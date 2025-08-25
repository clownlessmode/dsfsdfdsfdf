import { Button } from "@shared/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SplashPage = () => {
  return (
    <Link href={"/loyal"}>
      <main className="flex flex-col p-10 h-full min-h-screen gap-10 items-center">
        <Image
          alt=""
          src={"/burger.png"}
          width={1080}
          height={1920}
          className="overflow-hidden object-cover h-full rounded-4xl"
        />
        <Button size={"lg"} className="w-fit uppercase">
          Сделать заказ
        </Button>
      </main>
    </Link>
  );
};

export default SplashPage;
