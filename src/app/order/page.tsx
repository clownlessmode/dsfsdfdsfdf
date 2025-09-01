"use client";
import { useCart } from "@entities/cart";
import { useSession } from "@entities/session";
import { Button } from "@shared/ui/button";
import { Logotype } from "@shared/ui/logotype";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const { clearSession } = useSession();

  const handleNewOrder = () => {
    clearCart();
    clearSession();
    router.push("/");
  };
  return (
    <main className="flex flex-col justify-center p-10 h-full min-h-screen gap-10 items-center relative">
      <Logotype />
      <h1 className="text-center text-yellow-950 text-6xl font-bold mt-15">
        Спасибо за заказ!
      </h1>
      <h1 className="text-center text-yellow-950 opacity-50 text-3xl font-medium mt-10">
        Номер заказа
      </h1>
      <h1 className="text-center text-primary text-[250px] font-black leading-[200px]">
        80345
      </h1>
      <div className="bg-white rounded-[60px] shadow-xl p-10 pb-30 flex flex-col items-center justify-center">
        <Image
          src="/assets/camera.png"
          alt="order"
          width={100}
          height={100}
          className="size-[300px]"
        />
        <h1 className="text-center text-balance text-yellow-950 text-5xl font-bold mt-5">
          Запомни или сфотографируй номер заказа
        </h1>
        <h1 className="text-center text-balance text-yellow-950 opacity-80 text-4xl font-medium mt-10">
          Его нужно назвать на кассе для получения заказа. Чек и номер на нем не
          печатаются
        </h1>
      </div>
      <Button size={"lg"} className="-mt-20 " onClick={handleNewOrder}>
        Закрыть
      </Button>
    </main>
  );
};

export default Page;
