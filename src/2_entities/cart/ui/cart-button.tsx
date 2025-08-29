"use client";
import { Button } from "@shared/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useCart } from "../model/store";

export const CartButton = () => {
  const router = useRouter();
  const { cart } = useCart();
  return (
    <Button
      onClick={() => router.push("/cart")}
      size={"md"}
      className="!px-20 bg-background text-primary border-4 text-right border-primary shadow-lg shadow-primary/20"
    >
      <ShoppingCartIcon className="size-12 w-fit px-2" />{" "}
      {cart?.products
        .reduce((acc, product) => acc + product.price, 0)
        .toFixed(2)}
      ₽
    </Button>
  );
};
