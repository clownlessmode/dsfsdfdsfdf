"use client";
import { Button } from "@shared/ui/button";

import { useRouter } from "next/navigation";
import React from "react";
import { useCart } from "../model/store";
import ShoppingBagIcon from "@shared/assets/shopping-bag";

export const CartButton = () => {
  const router = useRouter();
  const { cart } = useCart();
  return (
    <Button onClick={() => router.push("/cart")}>
      <ShoppingBagIcon
        className="size-[50px]"
        fill="white"
        color="#E40046"
        strokeWidth={2}
      />
      {cart?.products
        .reduce((acc, product) => acc + product.price, 0)
        .toFixed(2)}
      ₽
    </Button>
  );
};
