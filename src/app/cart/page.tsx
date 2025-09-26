"use client";

import React from "react";
import { CartItem, useCart } from "@entities/cart";
import {
  Minus,
  Plus,
  Trash,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@shared/ui/button";
import { useRouter } from "next/navigation";
import { pluralize } from "@shared/lib/pluralize";
import Link from "next/link";
import ShoppingBagIcon from "@shared/assets/shopping-bag";
import { LoyaltyModal } from "./loyalty-modal";
import { CheckoutModal } from "./checkout-modal";
import { useSession } from "@entities/session";
import {
  createOrder,
  transformCartItemsToOrderProducts,
  formatPhoneNumber,
} from "@shared/api/orders";
import { cn } from "@shared/lib/utils";

// Функция для красивого форматирования номера телефона для отображения
const formatPhoneForDisplay = (phone: string): string => {
  // Убираем все символы кроме цифр
  const digitsOnly = phone.replace(/\D/g, "");

  // Если номер начинается с 7 и имеет 11 цифр, убираем 7
  let cleanNumber = digitsOnly;
  if (cleanNumber.startsWith("7") && cleanNumber.length === 11) {
    cleanNumber = cleanNumber.substring(1);
  } else if (cleanNumber.startsWith("8") && cleanNumber.length === 11) {
    cleanNumber = cleanNumber.substring(1);
  }

  // Форматируем как +7 (XXX) XXX XX-XX
  if (cleanNumber.length === 10) {
    return `+7 (${cleanNumber.substring(0, 3)}) ${cleanNumber.substring(
      3,
      6
    )} ${cleanNumber.substring(6, 8)}-${cleanNumber.substring(8)}`;
  }

  // Если формат не подходит, возвращаем как есть
  return phone;
};

const CartPage = () => {
  const { cart, clearCart } = useCart();
  const { session } = useSession();
  const router = useRouter();
  const [loyaltyModalOpen, setLoyaltyModalOpen] = React.useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = React.useState(false);

  const handleCheckout = () => {
    setCheckoutModalOpen(true);
  };

  const handleLoyaltyClick = () => {
    setLoyaltyModalOpen(true);
  };

  const handleLoyaltyClose = () => {
    setLoyaltyModalOpen(false);
  };

  const handleCheckoutClose = () => {
    setCheckoutModalOpen(false);
  };

  const handleMethodSelect = async (method: string) => {
    console.log("handleMethodSelect", method);
    if (!cart?.items || cart.items.length === 0) {
      alert("Корзина пуста");
      return;
    }

    if (!session?.idStore) {
      alert("Ошибка: не найден ID магазина");
      return;
    }

    try {
      // Преобразуем товары из корзины в формат API
      const products = transformCartItemsToOrderProducts(cart.items);

      // Форматируем номер телефона
      const phoneNumber = formatPhoneNumber(session.telephone);

      // Создаем заказ
      const result = await createOrder({
        products,
        idStore: session.idStore,
        phoneNumber,
        receivingMethod: method as "self_service" | "delivery",
      });

      if (result.success) {
        router.push(`/order?orderId=${result.orderId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(result);
        clearCart();
        // Не очищаем сессию здесь, так как idStore должен сохраняться
      } else {
        alert(`Ошибка при создании заказа: ${result.message}`);
      }
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
      alert("Произошла ошибка при создании заказа");
    }
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <main className="flex flex-col h-screen px-5 pt-10 pb-5 gap-5 overflow-hidden">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-6xl font-bold">Корзина пуста</h1>
        </div>
        <div className="flex flex-col gap-2.5 bg-[#F5F5F5] min-h-0 flex-1 rounded-[30px] p-2.5 overflow-hidden">
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-4">
                В корзине пока ничего нет
              </h2>
              <p className="text-3xl text-muted-foreground mb-8">
                Добавьте товары из каталога, чтобы оформить заказ
              </p>
            </div>
            <Button size={"lg"} onClick={() => router.push("/catalogue")}>
              Вернуться в каталог
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col h-screen px-5 pt-10 pb-5 gap-5 overflow-hidden">
      {/* <Logotype theme="dark" /> */}
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-6xl font-bold">
          {cart?.items.length}{" "}
          {pluralize(cart?.items.length, "товар", "товара", "товаров")} на{" "}
          {cart?.items.reduce((acc, item) => acc + item.totalPrice, 0)} ₽
        </h1>
        <button
          onClick={() => clearCart()}
          className="bg-muted size-24 rounded-full items-center justify-center flex"
        >
          <Trash className="size-12 text-foreground" />
        </button>
      </div>
      <div className="flex flex-col gap-2.5 bg-[#F5F5F5] min-h-0 flex-1 rounded-[30px] p-2.5 overflow-hidden">
        <div className="flex flex-row gap-2.5 bg-[#F5F5F5] min-h-0 flex-1 rounded-[30px] overflow-hidden">
          <section className="flex flex-col gap-1 py-2 bg-white rounded-[20px] flex-1 min-h-0 relative">
            <div className="flex-1 min-h-0 overflow-y-auto space-y-5 p-6">
              <div
                role="button"
                onClick={handleLoyaltyClick}
                className="flex flex-row justify-between items-center bg-muted rounded-[40px] px-10 py-5"
              >
                <div className="w-[100px]" />
                <p className="text-3xl font-medium text-center text-balance">
                  {session?.telephone
                    ? `Добавлена карта лояльности по номеру ${formatPhoneForDisplay(
                        session.telephone
                      )}`
                    : "Ввести карту лояльности"}
                </p>
                <Button
                  className={cn(
                    "!w-[100px] !h-[100px] !p-0 shrink-0",
                    session?.telephone && "bg-emerald-500"
                  )}
                  variant={"ghost"}
                >
                  {session?.telephone ? (
                    <Check className="!size-[50px]" color="white" />
                  ) : (
                    <ChevronRight className="!size-[50px]" />
                  )}
                </Button>
              </div>
              {cart?.items.map((item, index) => (
                <CartProductRow
                  key={`${item.product.id}-${
                    item.selectedType?.id || "default"
                  }-${JSON.stringify(item.extras)}-${Array.from(
                    item.removedIngredients
                  )
                    .sort()
                    .join(",")}-${index}`}
                  item={item}
                />
              ))}
            </div>
          </section>
        </div>
        {cart?.items?.length && cart?.items?.length > 0 ? (
          <div className="flex flex-row justify-between gap-2.5 bg-white rounded-[30px] px-[18px] py-[7px]">
            <Link href={`/catalogue`}>
              <Button className="aspect-square" size={"lg"} variant={"ghost"}>
                <ChevronLeft className="size-[50px] -ml-2" />
              </Button>
            </Link>
            <Button onClick={handleCheckout} size={"lg"} className="gap-2">
              <ShoppingBagIcon
                className="size-[80px]"
                fill="white"
                color="#E40046"
                strokeWidth={2}
              />
              {cart?.items
                .reduce((acc, item) => acc + item.totalPrice, 0)
                .toFixed(2)}
              ₽
            </Button>{" "}
          </div>
        ) : null}
      </div>

      <LoyaltyModal open={loyaltyModalOpen} onClose={handleLoyaltyClose} />
      <CheckoutModal
        open={checkoutModalOpen}
        onClose={handleCheckoutClose}
        onSelectMethod={handleMethodSelect}
      />
    </main>
  );
};

export default CartPage;

export const CartProductRow = ({ item }: { item: CartItem }) => {
  const { decreaseCartItemQuantity, increaseCartItemQuantity } = useCart();

  // Генерируем уникальный ID для товара в корзине
  const getCartItemId = (item: CartItem) => {
    return `${item.product.id}-${
      item.selectedType?.id || "default"
    }-${JSON.stringify(item.extras)}-${Array.from(item.removedIngredients)
      .sort()
      .join(",")}`;
  };

  return (
    <div className="flex flex-row justify-between w-full items-center">
      <div className="flex flex-row items-center gap-4">
        <Image
          loading="eager"
          priority={true}
          src={item.product.image}
          alt={item.product.name}
          width={500}
          height={500}
          className="rounded-[20px] w-[160px] aspect-square object-cover"
        />
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold">{item.product.name}</h2>
          <p className="text-2xl font-medium text-muted-foreground">
            {item.selectedType?.name}{" "}
            <span className="text-foreground/50 font-bold">
              {item.selectedType?.weight} г
            </span>
          </p>
          <div className="flex flex-row gap-2 my-3 max-w-[900px] overflow-x-auto">
            {Object.keys(item.extras).filter(
              (extraId) => item.extras[parseInt(extraId)] > 0
            ).length > 0 && (
              <div className="flex flex-row gap-1  shrink-0">
                {Object.keys(item.extras)
                  .filter((extraId) => item.extras[parseInt(extraId)] > 0)
                  .map((extraId) => {
                    const extra = item.product.extras?.find(
                      (e) => e.id.toString() === extraId
                    );
                    return (
                      <p
                        key={extraId}
                        className="text-2xl font-medium bg-green-100 rounded-[20px] p-2 text-center text-green-900"
                      >
                        {extra
                          ? `${extra.name} ${
                              item.extras[parseInt(extraId)] > 1
                                ? `x${item.extras[parseInt(extraId)]}`
                                : ""
                            }`
                          : `Доп ${extraId}`}
                      </p>
                    );
                  })}
              </div>
            )}
            {item.removedIngredients.size > 0 && (
              <div className="flex flex-row gap-1">
                {Array.from(item.removedIngredients).map((ingredientId) => {
                  const ingredientName = item.product.ingredients.find(
                    (ing) => ing.id === ingredientId
                  )?.name;
                  return (
                    <p
                      key={ingredientId}
                      className="text-2xl font-medium bg-red-100 rounded-[20px] p-2 text-center text-red-900"
                    >
                      <span className="line-through">
                        {ingredientName || `Ingredient ${ingredientId}`}
                      </span>
                    </p>
                  );
                })}
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold mt-1">{item.totalPrice} ₽</h2>
        </div>
      </div>
      <div className="flex flex-row items-center gap-4 bg-muted px-8 py-4 h-fit rounded-full">
        <button onClick={() => decreaseCartItemQuantity(getCartItemId(item))}>
          <Minus className="size-14" strokeWidth={2.5} />
        </button>
        <p className="text-5xl font-medium">{item.quantity}</p>
        <button onClick={() => increaseCartItemQuantity(getCartItemId(item))}>
          <Plus className="size-14" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
