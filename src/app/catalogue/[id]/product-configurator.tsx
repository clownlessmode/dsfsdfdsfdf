"use client";

import { TabsContent, Tabs, TabsList, TabsTrigger } from "@shared/ui/tabs";
import Image from "next/image";
import { ChevronLeft, Minus, Plus } from "lucide-react";
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

interface Props {
  product: IProduct | null;
}

export const ProductConfigurator = ({ product }: Props) => {
  const { addProduct } = useCart();
  const router = useRouter();
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [ingredientsCount, setIngredientsCount] = useState<
    Record<number, number>
  >({});

  useEffect(() => {
    if (!selectedTypeId && product?.types?.length) {
      setSelectedTypeId(product.types[0].id.toString());
    }
  }, [product, selectedTypeId]);

  // Initialize each ingredient count to 1 once when product loads
  useEffect(() => {
    const ingredients = product?.ingredients ?? [];
    if (ingredients.length === 0) return;
    setIngredientsCount((prev) => {
      if (Object.keys(prev).length > 0) return prev;
      const initial: Record<number, number> = {};
      for (const ing of ingredients) {
        initial[ing.id] = 1;
      }
      return initial;
    });
  }, [product]);

  const selectedType = product?.types?.find(
    (t) => t.id.toString() === selectedTypeId
  );
  const unitPrice = selectedType?.price ?? 0;
  const ingredientsTotal = useMemo(() => {
    if (!product?.ingredients) return 0;
    return product.ingredients.reduce((sum, ing) => {
      const count = ingredientsCount[ing.id] ?? 0;
      const price = ing.price ?? 0;
      const extraCount = Math.max(0, count - 1); // baseline 1 doesn't reduce price
      return sum + extraCount * price;
    }, 0);
  }, [product, ingredientsCount]);
  const totalPrice = unitPrice * quantity + ingredientsTotal;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleAddToCart = () => {
    if (!product) return;
    addProduct({
      ...product,
      price: totalPrice,
    });
    setIsDialogOpen(true);
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden p-10 gap-10 bg-muted justify-start">
      <Image
        src={product?.image ?? ""}
        alt={product?.name ?? ""}
        className="h-[500px] w-full object-cover overflow-hidden bg-black  rounded-[60px] shadow-lg"
        width={500}
        height={500}
      />
      <div className="flex flex-col gap-8 items-center justify-center">
        <div className="flex flex-row gap-4 justify-between w-full items-center ">
          <Link href="/catalogue">
            <ChevronLeft className="size-15 text-muted-foreground" />
          </Link>

          <h1 className="text-7xl font-black">{product?.name}</h1>

          <div className="size-15 " />
        </div>
        <h2 className="text-3xl font-medium text-center text-muted-foreground">
          {product?.information?.description}
        </h2>
        <Tabs className="w-full" defaultValue="settings">
          <TabsList className="w-full bg-white">
            {product?.types?.length && (
              <TabsTrigger className="w-full" value="settings">
                Настроить
              </TabsTrigger>
            )}
            {product?.ingredients?.length && (
              <TabsTrigger className="w-full" value="ingredients">
                Изменить состав
              </TabsTrigger>
            )}
            {product?.information?.description && (
              <TabsTrigger className="w-full" value="description">
                Описание
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="settings">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-black mt-10 mb-4 text-center">
                Выберите опции
              </h1>
              <RadioGroup.Root
                className="flex flex-row gap-4 w-full"
                value={selectedTypeId ?? undefined}
                onValueChange={(val) => setSelectedTypeId(val)}
              >
                {product?.types?.map((type) => (
                  <RadioGroup.Item
                    key={type.id}
                    value={type.id.toString()}
                    id={type.id.toString()}
                    asChild
                  >
                    <div className="group flex flex-col gap-0 w-full rounded-[60px] px-[10px] py-[40px] h-[160px] items-center justify-center bg-white shadow-lg transition-colors data-[state=checked]:bg-primary data-[state=checked]:text-white">
                      <h2 className="text-[40px] font-bold text-center">
                        {type.name}
                      </h2>
                      <p className="text-3xl text-muted-foreground text-center group-data-[state=checked]:text-white">
                        {type.price}₽
                      </p>
                    </div>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </div>
          </TabsContent>
          <TabsContent value="ingredients">
            <div className="flex flex-col gap-4 mt-10 h-fit overflow-y-auto max-h-[690px]">
              <div className="grid grid-cols-3 gap-4">
                {product?.ingredients?.map((ingredient) => (
                  <Ingredient
                    key={ingredient.id}
                    ingredient={ingredient}
                    count={ingredientsCount[ingredient.id] ?? 0}
                    onIncrement={() =>
                      setIngredientsCount((prev) => ({
                        ...prev,
                        [ingredient.id]: (prev[ingredient.id] ?? 0) + 1,
                      }))
                    }
                    onDecrement={() =>
                      setIngredientsCount((prev) => ({
                        ...prev,
                        [ingredient.id]: Math.max(
                          0,
                          (prev[ingredient.id] ?? 0) - 1
                        ),
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="description">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-0">
                <h1 className="text-4xl font-black mt-10 mb-4 text-center">
                  Состав
                </h1>
                <div className="w-full bg-background rounded-[60px] p-10">
                  <p className="text-4xl font-bold text-foreground!">
                    {product?.information?.composition}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-0">
                <h1 className="text-4xl font-black mt-10 mb-4 text-center">
                  Пищевая ценность в 100 грамм
                </h1>

                <div className="flex justify-center items-start gap-5 w-full">
                  {product?.information?.fats && (
                    <NutritionCard
                      title="Жиры"
                      value={product?.information?.fats}
                    />
                  )}
                  {product?.information?.proteins && (
                    <NutritionCard
                      title="Белки"
                      value={product?.information?.proteins}
                    />
                  )}
                  {product?.information?.carbohydrates && (
                    <NutritionCard
                      title="Углеводы"
                      value={product?.information?.carbohydrates}
                    />
                  )}
                  {product?.information?.calories && (
                    <NutritionCard
                      title="Ккал"
                      value={product?.information?.calories}
                    />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="absolute bottom-20 px-20 left-0 w-full flex flex-row justify-between">
          <div className="flex flex-row gap-4 items-center">
            <Button
              variant="outline"
              className=" rounded-full  bg-background size-15 !text-foreground border-foreground border-4 opacity-80"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus className="size-12" />
            </Button>
            <p className="text-7xl font-bold">{quantity}</p>
            <Button
              variant="outline"
              className=" rounded-full  bg-background size-15 !text-foreground  border-foreground border-4 opacity-80"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="size-12" />
            </Button>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Button
              size={"md"}
              className="!px-20 bg-background text-primary border-4 border-primary shadow-lg shadow-primary/20"
              onClick={handleAddToCart}
            >
              В корзину {totalPrice.toFixed(2).toLocaleString()}₽
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[920px] !max-w-none rounded-[60px] h-fit">
          <DialogHeader>
            <DialogTitle className="">Добавить к заказу?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-10 justify-center items-center relative">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                role="button"
                onClick={() => setIsDialogOpen(false)}
                className="flex flex-col gap-3"
              >
                <Product product={product as IProduct} isLoading={false} />
                <Button className="rounded-full text-4xl h-[60px]">
                  Добавить
                </Button>
              </div>
            ))}
            <Button
              size={"lg"}
              variant={"outline"}
              onClick={() => {
                setIsDialogOpen(false);
                router.push("/catalogue");
              }}
              className="absolute shadow-2xl -bottom-[200px] right-1/2 translate-x-1/2 z-[99999999]"
            >
              Пропустить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

const NutritionCard = ({ title, value }: { title: string; value: number }) => {
  return (
    <div className="w-full p-5 bg-white rounded-[60px] inline-flex flex-col justify-center items-center gap-2.5">
      <div className="self-stretch text-center justify-center text-stone-500 text-3xl font-semibold font-['IBM_Plex_Sans']">
        {title}
      </div>
      <div className="w-10 inline-flex justify-center items-center gap-5">
        <div className="flex-1 justify-center text-yellow-950 text-6xl font-semibold font-['IBM_Plex_Sans']">
          {value}
        </div>
      </div>
    </div>
  );
};
