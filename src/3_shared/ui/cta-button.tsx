import { cn } from "@shared/lib/utils";
import Image from "next/image";
import React from "react";

const CtaButton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative w-[705px] h-[200px] rounded-full overflow-hidden animate-pulse-soft",
        className
      )}
    >
      <Image
        src="/assets/cta-button.png"
        alt="CTA Button"
        width={705 * 2}
        height={200 * 2}
        className={cn("w-full h-full")}
        priority
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
        <div className="absolute top-1/2 -translate-y-1/2 left-[-200%] w-[35%] h-[300%] rotate-45 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[2px] animate-shimmer" />
      </div>
    </div>
  );
};

export default CtaButton;
