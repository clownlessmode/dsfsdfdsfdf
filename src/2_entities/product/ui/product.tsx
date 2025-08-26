import Image from "next/image";
import React from "react";
import { IProduct } from "../config";

interface IProps {
  product: IProduct;
}

export const Product = ({ product }: IProps) => {
  return (
    <div className="flex flex-col gap-1 ">
      <Image
        src={product.image}
        alt="category"
        className="bg-white rounded-[40px] w-full aspect-square object-cover shadow-lg"
        width={500}
        height={500}
      />
      <div className="flex flex-col gap-1">
        <p className="text-center justify-start text-foreground text-3xl font-black">
          {product.name}
        </p>
        <p className="text-center justify-start text-foreground text-2xl font-semibold">
          {product.price} ₽
        </p>
      </div>
    </div>
  );
};
