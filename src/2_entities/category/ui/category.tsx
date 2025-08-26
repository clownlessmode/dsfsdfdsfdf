import Image from "next/image";
import React from "react";
import { ICategory } from "../config";

interface IProps {
  category: ICategory;
}

export const Category = ({ category }: IProps) => {
  return (
    <div className="flex flex-col gap-1">
      <Image
        src={category.image}
        alt="category"
        className="bg-white rounded-[40px] w-full aspect-square object-cover"
        width={500}
        height={500}
      />
      <div className="self-stretch text-center justify-start text-foreground text-3xl font-semibold">
        {category.name}
      </div>
    </div>
  );
};
