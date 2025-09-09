"use client";

import { TabsContent, Tabs, TabsList, TabsTrigger } from "@shared/ui/tabs";
import Image from "next/image";
import { ChevronLeft, Info, Minus, Plus } from "lucide-react";
import Link from "next/link";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Ingredient } from "@entities/product/ui/ingredient";
import { useCart } from "@entities/cart/model/store";
import { useRouter } from "next/navigation";
import { IProduct, Product } from "@entities/product";
import { useEffect, useMemo, useState } from "react";
import Background from "./background";
import { InfoModal } from "./info-modal";
import { hexToHsl, setHslBrightness } from "@shared/lib/utils";
import { AnimatedTabs } from "@shared/ui/animated-tabs";
import { MakeSweet } from "./make-sweet";

interface Props {
  product: IProduct | null;
}

export const ProductConfigurator = ({ product }: Props) => {
  const { addProduct } = useCart();
  const router = useRouter();
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [extrasCount, setextrasCount] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!selectedTypeId && product?.types?.length) {
      setSelectedTypeId(product.types[0].id.toString());
    }
  }, [product, selectedTypeId]);

  // Initialize each ingredient count to 1 once when product loads
  useEffect(() => {
    const extras = product?.extras ?? [];
    if (extras.length === 0) return;
    setextrasCount((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const initial: Record<number, number> = {};
      for (const ing of extras) {
        initial[ing.id] = 1;
      }
      return initial;
    });
  }, [product]);

  const selectedType = product?.types?.find(
    (t) => t.id.toString() === selectedTypeId
  );
  const unitPrice = selectedType?.price ?? 0;
  const extrasTotal = useMemo(() => {
    if (!product?.extras) return 0;
    return product.extras.reduce((sum, ing) => {
      const count = extrasCount[ing.id] ?? 0;
      const price = ing.price ?? 0;
      const extraCount = Math.max(0, count - 1); // baseline 1 doesn't reduce price
      return sum + extraCount * price;
    }, 0);
  }, [product, extrasCount]);
  const totalPrice = unitPrice * quantity + extrasTotal;

  const hslColor = hexToHsl(product?.color ?? "#ffffff");
  const hslColorBright = setHslBrightness(hslColor, 20);
  const [isExtrasOpen, setIsExtrasOpen] = useState(false);

  if (!product) {
    return null;
  }
  return (
    <main className="relative flex flex-col gap-5 justify-between items-center h-full py-[60px] px-[48px]">
      <div className="inset-0 absolute -z-10">
        <Background color={product.color} />
      </div>
      {product.extras && product.extras.length > 0 && (
        <MakeSweet
          product={product}
          isOpen={isExtrasOpen}
          setIsOpen={setIsExtrasOpen}
        />
      )}
      <div className="flex flex-col items-center">
        <Image
          alt={product.name || "product"}
          className="aspect-square w-full object-cover"
          src={product.image}
          width={1980}
          height={1980}
        />
        <h1
          className="text-[128px] !font-black mt-4 -tracking-[10px] font-inter leading-none"
          style={{
            color: hslColorBright,
          }}
        >
          {product.name}
        </h1>
        <p
          className="text-[48px] font-regular tracking-tight mt-4 text-balance text-center leading-none"
          style={{
            color: hslColorBright,
          }}
        >
          {product.information?.description}
        </p>

        <AnimatedTabs
          items={
            product.types?.map((type) => ({
              id: type.id.toString(),
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
        <Link href="/catalogue">
          <Button className="aspect-square" size={"lg"} variant={"ghost"}>
            <ChevronLeft className="size-[72px] -ml-2" />
          </Button>
        </Link>

        <div className="flex flex-row gap-5">
          <InfoModal product={product} />
          <Button size={"lg"}>+{product?.price} ₽</Button>
        </div>
      </div>
    </main>
  );
};
