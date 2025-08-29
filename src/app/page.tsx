import { mock as advertisementsMock } from "@entities/advertisement";
import { AdvertisementFullscreen } from "@entities/advertisement/ui/advertisement-fullscreen";
import { Button } from "@shared/ui/button";
import { Logotype } from "@shared/ui/logotype";
import Link from "next/link";
import React from "react";

const getAdvertisements = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return advertisementsMock;
};

const SplashPage = async () => {
  const advertisements = await getAdvertisements();
  return (
    <Link href={"/loyal"}>
      <main className="flex flex-col justify-end pb-20 h-full min-h-screen gap-10 items-center relative">
        <div className="absolute mx-auto top-40">
          <Logotype />
        </div>
        <AdvertisementFullscreen advertisements={advertisements ?? []} />
        <Button size={"lg"}>Сделать заказ</Button>
      </main>
    </Link>
  );
};

export default SplashPage;
