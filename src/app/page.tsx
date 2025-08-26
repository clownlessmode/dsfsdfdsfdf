import { Advertisement } from "@entities/advertisement";
import { Button } from "@shared/ui/button";
import { Logotype } from "@shared/ui/logotype";
import Link from "next/link";
import React from "react";

const SplashPage = () => {
  return (
    <Link href={"/loyal"}>
      <main className="flex flex-col justify-end pb-20 h-full min-h-screen gap-10 items-center relative">
        <div className="absolute mx-auto top-40">
          <Logotype />
        </div>
        <Advertisement />
        <Button size={"lg"}>Сделать заказ</Button>
      </main>
    </Link>
  );
};

export default SplashPage;
