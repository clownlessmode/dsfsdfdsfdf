import { Button } from "@shared/ui/button";
import { Logotype } from "@shared/ui/logotype";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SplashPage = () => {
  return (
    <Link href={"/loyal"}>
      <main className="flex flex-col justify-end pb-20 h-full min-h-screen gap-10 items-center relative">
        <div className="absolute mx-auto top-20">
          <Logotype />
        </div>
        <Image
          alt=""
          src={"/burger.png"}
          width={1080}
          height={1920}
          className="overflow-hidden object-cover h-full absolute -z-1 left-0 top-0"
        />
        <Button size={"lg"}>Сделать заказ</Button>
      </main>
    </Link>
  );
};

export default SplashPage;
