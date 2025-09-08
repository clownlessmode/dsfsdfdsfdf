"use client";
import React from "react";
import { useCart } from "../model/store";
import Image from "next/image";

export const CartRow = () => {
  const { cart } = useCart();
  return (
    <div className="flex flex-row -space-x-[35px]">
      {cart?.products.map((product) => (
        <Image
          key={product.id}
          src={product.image}
          alt={product.name}
          className="rounded-[10px] w-[100px] aspect-square object-cover"
          width={500}
          height={500}
        />
      ))}
    </div>
  );
};
