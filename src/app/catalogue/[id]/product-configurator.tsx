"use client";

import NextImage from "next/image";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@shared/ui/button";
import { useCart } from "@entities/cart/model/store";
import { IProduct } from "@entities/product";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Background from "./background";
import { InfoModal } from "./info-modal";
import { hexToHsl, setHslBrightness } from "@shared/lib/utils";
import { AnimatedTabs } from "@shared/ui/animated-tabs";
import { MakeSweet } from "./make-sweet";
import { CartItem } from "@entities/cart/config/types";
import { useRouter } from "next/navigation";

interface Props {
  product: IProduct | null;
}

export const ProductConfigurator = ({ product }: Props) => {
  const { addCartItem } = useCart();
  const router = useRouter();
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [quantity] = useState<number>(1);
  const [extrasCount, setextrasCount] = useState<Record<number, number>>({});
  const [removedIngredients, setRemovedIngredients] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (!selectedTypeId && product?.type?.length) {
      const firstValidType = product.type.find((t) => t && t.id != null);
      if (firstValidType) {
        setSelectedTypeId(String(firstValidType.id));
      }
    }
  }, [product, selectedTypeId]);

  useEffect(() => {
    const raw = product?.extras ?? [];
    const extras = raw.filter(
      (e) => e && typeof e.id === "number" && (e.name || e.image)
    );
    if (extras.length === 0) return;
    setextrasCount((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const initial: Record<number, number> = {};
      for (const ing of extras) {
        initial[ing.id] = 0; // Начинаем с 0, а не с 1
      }
      return initial;
    });
  }, [product]);

  const selectedType = product?.type?.find(
    (t) => t && t.id != null && String(t.id) === selectedTypeId
  );
  const unitPrice = selectedType?.price ?? 0;
  const extrasTotal = useMemo(() => {
    if (!product?.extras) return 0;
    return product.extras.reduce((sum, ing) => {
      const count = extrasCount[ing.id] ?? 0;
      const price = ing.price ?? 0;
      // Добавляем цену только за дополнительные ингредиенты (счетчик начинается с 0)
      return sum + count * price;
    }, 0);
  }, [product, extrasCount]);
  const totalPrice = (unitPrice + extrasTotal) * quantity;

  const hslColor = hexToHsl(product?.color ?? "#ffffff");
  const hslColorBright = setHslBrightness(hslColor, 20);
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);
  const searchParams = useSearchParams();
  const hasValidExtras =
    (product?.extras?.filter((e) => e && (e.name || e.image)).length ?? 0) > 0;
  const hasIngredients = (product?.ingredients?.length ?? 0) > 0;

  // Авто-открытие "MakeSweet" при наличии флага в URL
  useEffect(() => {
    const shouldOpen = searchParams?.get("openextras") === "1";
    if (shouldOpen) setIsExtrasOpen(true);
  }, [searchParams]);
  const handleAddToCart = () => {
    if (!product || !selectedType) return;

    const cartItem: CartItem = {
      product,
      selectedType,
      quantity,
      extras: extrasCount,
      removedIngredients,
      totalPrice,
    };

    addCartItem(cartItem);
    router.push(`/catalogue#${product.id}`);
  };

  if (!product) {
    return null;
  }
  return (
    <main className="relative flex flex-col gap-5 justify-between items-center h-full py-[60px] px-[48px]">
      <div className="inset-0 absolute -z-10">
        <Background color={product.color ?? "#ffffff"} />
      </div>
      {(hasValidExtras || hasIngredients) && (
        <MakeSweet
          product={product}
          isOpen={isExtrasOpen}
          setIsOpen={setIsExtrasOpen}
          extrasCount={extrasCount}
          setExtrasCount={setextrasCount}
          removedIngredients={removedIngredients}
          setRemovedIngredients={setRemovedIngredients}
          totalPrice={totalPrice}
          onAddToCart={handleAddToCart}
        />
      )}
      <div className="flex flex-col items-center">
        <NextImage
          loading="eager"
          priority={true}
          alt={product.name || "product"}
          className="aspect-square w-full object-cover"
          src={product.image ?? null}
          width={1080}
          height={1080}
        />
        <h1
          className="text-[100px] !font-black mt-4 -tracking-[6px] font-inter leading-none text-center text-balance w-full"
          style={{
            color: hslColorBright,
          }}
        >
          {product.name}
        </h1>
        <p
          className="text-[48px] font-regular tracking-tight mt-4 text-center leading-none text-balance w-full"
          style={{
            color: hslColorBright,
          }}
        >
          {product.information?.description}
        </p>

        <AnimatedTabs
          items={
            product.type
              ?.filter((type) => type && type.id != null)
              .map((type) => ({
                id: String(type.id),
                name: type.name,
                price: type.price,
              })) || []
          }
          selectedId={selectedTypeId}
          onSelect={(id) => setSelectedTypeId(id)}
          className="h-44 bg-black/5 mt-30"
          inactiveTextColor={hslColorBright}
          activeTextColor="white"
          itemWidth={300}
          itemHeight={160}
          gap={8}
        />
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <Link href={`/catalogue#${product.id}`}>
          <Button className="aspect-square" size={"lg"} variant={"ghost"}>
            <ChevronLeft className="size-[72px] -ml-2" />
          </Button>
        </Link>

        <div className="flex flex-row gap-5">
          <InfoModal product={product} />
          <Button size={"lg"} onClick={handleAddToCart}>
            +{totalPrice} ₽
          </Button>
        </div>
      </div>
    </main>
  );
};
