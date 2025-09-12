"use client";
import Background from "@app/catalogue/[id]/background";
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
  const [timeLeft, setTimeLeft] = React.useState(60);

  const handleNewOrder = () => {
    clearCart();
    clearSession();
    router.push("/");
  };

  // Таймер на 60 секунд
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNewOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <main className="flex flex-col justify-center  p-10 h-full min-h-screen gap-10 items-center relative">
      <div className="inset-0 absolute -z-10">
        <Background color="#FFE5E5" />
      </div>
      <Logotype theme="dark" className="size-[800px] h-auto" />

      <h1 className="text-center text-yellow-950 text-8xl font-black mt-15">
        Спасибо за заказ!
      </h1>

      {/* Таймер */}
      <div className="bg-white/20 backdrop-blur-xl rounded-[40px] px-8 py-4">
        <p className="text-center text-yellow-950 text-3xl font-semibold">
          Автоматический переход через: {timeLeft} сек
        </p>
      </div>
      <h1 className="text-center text-yellow-950 opacity-50 text-4xl font-medium mt-10">
        Номер заказа
      </h1>
      <h1 className="text-center text-primary text-[250px] font-black leading-[150px]">
        80345
      </h1>
      <div className="bg-white/20 backdrop-blur-xl mt-50 rounded-[60px] shadow-xl p-10 pb-30 flex flex-col items-center justify-center">
        <Image
          src="/assets/camera.png"
          alt="order"
          width={100}
          height={100}
          className="size-[300px] -mt-[200px]"
        />
        <h1 className="text-center text-balance text-yellow-950 text-5xl font-bold mt-5">
          Запомни или сфотографируй номер заказа
        </h1>
        <h1 className="text-center text-balance text-yellow-950 opacity-80 text-4xl font-medium mt-10">
          Его нужно назвать на кассе для получения заказа. Чек и номер на нем не
          печатаются
        </h1>
      </div>
      <Button size={"lg"} className=" px-30 " onClick={handleNewOrder}>
        Новый заказ
      </Button>
    </main>
  );
};

export default Page;
