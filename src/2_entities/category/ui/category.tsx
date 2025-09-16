import Image from "next/image";
import React from "react";
import { ICategory } from "../config";
import { cn } from "@shared/lib/utils";

interface IProps {
  category: ICategory;
  isActive: boolean;
  onClick: () => void;
}

export const Category = ({ category, isActive, onClick }: IProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1  rounded-[40px] w-[180px] aspect-square items-center justify-center",
        isActive && "bg-muted"
      )}
      onClick={onClick}
    >
      <Image
        unoptimized
        src={category.image ?? null}
        alt="category"
        className="rounded-[10px] w-[100px] aspect-square object-cover"
        width={500}
        height={500}
      />
      <div className="text-center text-foreground text-3xl font-semibold">
        {category.name}
      </div>
    </div>
  );
};
