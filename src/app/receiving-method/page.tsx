"use client";
import {
  ReceivingMethod as ReceivingMethodEnum,
  useSession,
} from "@entities/session";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const ReceivingMethod = () => {
  const { setSession, session } = useSession();
  const router = useRouter();
  const handleReceivingMethod = (method: ReceivingMethodEnum) => {
    setSession({
      receivingMethod: method,
      telephone: session?.telephone ?? "",
    });
    router.push("/catalogue");
  };

  return (
    <main className="flex flex-col min-h-screen p-10 gap-8 bg-muted justify-center items-center">
      <div className="w-[850px] px-14 py-10 bg-white rounded-[60px] shadow-xl inline-flex flex-col justify-start items-center gap-14">
        <div className="self-stretch text-center justify-start text-yellow-950 text-6xl font-bold font-['IBM_Plex_Sans']">
          Как хотите
          <br />
          получить заказ?
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-12">
          <div
            className="flex-1 inline-flex flex-col justify-center items-center gap-7 cursor-pointer active:scale-95 transition-all duration-300"
            onClick={() =>
              handleReceivingMethod(ReceivingMethodEnum.ON_THE_PLATE)
            }
          >
            <div className="self-stretch h-72 p-2.5 relative bg-stone-100 rounded-[60px] shadow-[inset_0px_0px_9.600000381469727px_0px_rgba(229,0,70,0.22)] outline outline-1 outline-offset-[-1px] outline-rose-600 inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <Image
                src="/receiving-method/on-the-plate.png"
                alt="На подносе"
                width={391}
                height={391}
              />
            </div>
            <div className="self-stretch text-center justify-start text-yellow-950 text-4xl font-semibold font-['IBM_Plex_Sans']">
              На подносе
            </div>
          </div>
          <div
            className="flex-1 inline-flex flex-col justify-center items-center gap-7 cursor-pointer active:scale-95 transition-all duration-300"
            onClick={() => handleReceivingMethod(ReceivingMethodEnum.IN_A_BAG)}
          >
            <div className="self-stretch h-72 p-2.5 relative bg-stone-100 rounded-[60px] shadow-[inset_0px_0px_9.600000381469727px_0px_rgba(229,0,70,0.22)] outline outline-1 outline-offset-[-1px] outline-rose-600 inline-flex justify-center items-center gap-2.5 overflow-hidden">
              <Image
                src="/receiving-method/in-a-bag.png"
                alt="В пакете"
                width={412}
                height={412}
              />
            </div>
            <div className="self-stretch text-center justify-start text-yellow-950 text-4xl font-semibold font-['IBM_Plex_Sans']">
              В пакете
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ReceivingMethod;
