"use client";
import { Button } from "@shared/ui/button";

import { NumberKeypad } from "@shared/ui/number-keyboard";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const LoyalCardPage = () => {
  const [value, setValue] = useState("");

  return (
    <main className="flex flex-col justify-start p-20 h-full min-h-screen gap-10 items-center">
      <Image
        alt=""
        src={"/burger.png"}
        width={1080}
        height={1920}
        className="overflow-hidden object-cover h-full rounded-4xl"
      />
      <div className="flex flex-col gap-8 w-full">
        <div className="flex flex-row justify-between w-full gap-2">
          <Button size={"md"}>По номеру телефона</Button>
          <Button size={"md"} variant={"secondary"} disabled>
            По QR-Коду
          </Button>
        </div>
        <NumberKeypad
          placeholder="+7"
          value={value}
          onChange={setValue}
          maxLength={11}
        />
        <div className="flex flex-row justify-between w-full gap-2">
          <Link href={"/catalogue"}>
            <Button
              size={"md"}
              variant={"secondary"}
              className="text-6xl px-20"
            >
              Пропустить
            </Button>
          </Link>
          <Button size={"md"} className="text-6xl px-20" disabled>
            Войти{" "}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default LoyalCardPage;
