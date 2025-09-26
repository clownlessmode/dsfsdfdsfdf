"use client";
import Background from "@app/catalogue/[id]/background";
import { useCart } from "@entities/cart";
import { useSession } from "@entities/session";
import { Button } from "@shared/ui/button";
import { Logotype } from "@shared/ui/logotype";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { motion } from "framer-motion";
import QRCode from "qrcode";

const OrderContent = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const { clearUserData } = useSession();
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>("");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const handleNewOrder = React.useCallback(() => {
    clearCart();
    clearUserData(); // Очищаем только пользовательские данные, сохраняя idStore
    router.push("/"); // Перекидываем на главную
  }, [clearCart, clearUserData, router]);

  const handleTimerExpired = React.useCallback(() => {
    clearCart();
    clearUserData(); // Очищаем только пользовательские данные, сохраняя idStore
    router.push("/"); // Перекидываем на главную при истечении таймера
  }, [clearCart, clearUserData, router]);
  const formatOrderId = (id: string | number | null | undefined) => {
    if (id === null || id === undefined) return "";
    const lastThree = id.toString().slice(-3);
    const trimmed = lastThree.replace(/^0+/, "");
    return trimmed || "0";
  };
  // Таймер на 60 секунд
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle timer expiration separately to avoid setState during render
  React.useEffect(() => {
    if (timeLeft === 0) {
      handleTimerExpired();
    }
  }, [timeLeft, handleTimerExpired]);

  // Generate QR code for order ID
  React.useEffect(() => {
    if (orderId) {
      QRCode.toDataURL(`IM${orderId}`, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then(setQrCodeDataUrl)
        .catch(console.error);
    }
  }, [orderId]);
  return (
    <main className="flex flex-col justify-center  p-10 h-full min-h-screen gap-10 items-center relative">
      <div className="inset-0 absolute -z-10">
        <Background color="#FFE5E5" />
      </div>

      {/* Логотип с анимацией появления */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: -50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
        }}
      >
        <Logotype theme="dark" className="size-[800px] h-auto" />
      </motion.div>

      {/* Заголовок благодарности */}
      <motion.h1
        className="text-center text-yellow-950 text-8xl font-black mt-15"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: "easeOut",
        }}
      >
        Спасибо за заказ!
      </motion.h1>

      {/* Таймер с пульсацией */}
      <motion.div
        className="bg-white/20 backdrop-blur-xl rounded-[40px] px-8 py-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: [
            "0 0 0 0 rgba(255, 255, 255, 0.3)",
            "0 0 0 10px rgba(255, 255, 255, 0)",
            "0 0 0 0 rgba(255, 255, 255, 0)",
          ],
        }}
        transition={{
          duration: 0.5,
          delay: 0.6,
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <p className="text-center text-yellow-950 text-3xl font-semibold">
          Автоматический переход через: {timeLeft} сек
        </p>
      </motion.div>

      {/* Подзаголовок номера заказа */}
      <motion.h1
        className="text-center text-yellow-950 opacity-50 text-4xl font-medium mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.8,
          ease: "easeOut",
        }}
      >
        Номер заказа
      </motion.h1>

      {/* Номер заказа с эффектом печатания */}
      <motion.h1
        className="text-center text-primary text-[250px] font-black leading-[150px]"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 1.0,
          ease: "easeOut",
          type: "spring",
          stiffness: 80,
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        {orderId ? formatOrderId(orderId) : ""}
      </motion.h1>

      {/* Карточка с инструкцией */}
      <motion.div
        className="bg-white/20 backdrop-blur-xl mt-50 rounded-[60px] shadow-xl p-10 pb-30 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 1.2,
          ease: "easeOut",
          type: "spring",
          stiffness: 60,
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.5,
            ease: "easeOut",
          }}
        >
          {qrCodeDataUrl && (
            <Image
              loading="eager"
              priority={true}
              src={qrCodeDataUrl}
              alt="QR код заказа"
              width={300}
              height={300}
              className="size-[300px] -mt-[200px]"
            />
          )}
        </motion.div>

        <motion.h1
          className="text-center text-balance text-yellow-950 text-5xl font-bold mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.7,
            ease: "easeOut",
          }}
        >
          Запомни номер заказа или сфотографируй QR-код
        </motion.h1>

        <motion.h1
          className="text-center text-balance text-yellow-950 opacity-80 text-4xl font-medium mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.9,
            ease: "easeOut",
          }}
        >
          Назови номер на кассе или покажи QR-код для получения заказа.
        </motion.h1>
      </motion.div>

      {/* Кнопка нового заказа */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 2.1,
          ease: "easeOut",
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
        whileTap={{
          scale: 0.95,
          transition: { duration: 0.1 },
        }}
      >
        <Button size={"lg"} className=" px-30 " onClick={handleNewOrder}>
          Новый заказ
        </Button>
      </motion.div>
    </main>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <main className="flex flex-col justify-center p-10 h-full min-h-screen gap-10 items-center relative">
          <div className="inset-0 absolute -z-10">
            <Background color="#FFE5E5" />
          </div>
          <div className="text-center text-yellow-950 text-4xl font-medium">
            Загрузка...
          </div>
        </main>
      }
    >
      <OrderContent />
    </Suspense>
  );
};

export default Page;
