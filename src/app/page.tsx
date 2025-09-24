import { AdvertisementFullscreen } from "@entities/advertisement/ui/advertisement-fullscreen";
import CtaButton from "@shared/ui/cta-button";
import { Logotype } from "@shared/ui/logotype";
import Link from "next/link";
import React from "react";

export const revalidate = 3600;

const getAdvertisements = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/banner-main`,
      { credentials: "include", next: { tags: ["advertisements"] } }
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch advertisements:", error);
    return { data: [], success: false };
  }
};

const SplashPage = async () => {
  const advertisements = await getAdvertisements();

  return (
    <Link href={"/catalogue"} className="w-screen h-screen flex relative">
      <div className="bg-gradient-to-b from-white/0 to-white absolute inset-0 top-1/2 z-10" />
      <AdvertisementFullscreen advertisements={advertisements.data} />
      <Logotype className="absolute top-10 left-10" />
      <p className="text-black opacity-50 text-5xl font-medium absolute bottom-[385px] text-center left-1/2 -translate-x-1/2 z-20">
        нажмите на кнопку, чтобы сделать заказ
      </p>
      <CtaButton className="absolute bottom-36 left-1/2 -translate-x-1/2 z-20" />
    </Link>
  );
};

export default SplashPage;
