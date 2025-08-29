import Image from "next/image";
import React from "react";
import { IProduct } from "../config";
import Link from "next/link";
import { Skeleton } from "@shared/ui/skeleton";

interface IProps {
  product: IProduct;
  isLoading?: boolean;
}

export const Product = ({ product, isLoading = false }: IProps) => {
  if (isLoading) {
    return (
      <Link
        href={`/catalogue/${product.id}`}
        className="flex flex-col gap-1 items-center w-full"
      >
        <Skeleton className="rounded-[40px] w-full aspect-square object-cover shadow-lg" />
        <div className="flex flex-col gap-1 w-full items-center">
          <Skeleton className="text-center justify-start text-foreground text-3xl font-black h-10 shadow-lg rounded-full w-2/3" />

          <Skeleton className="text-center justify-start text-foreground text-2xl font-semibold h-10 shadow-lg rounded-full w-1/3" />
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/catalogue/${product.id}`}
      className="flex flex-col gap-1 w-full h-fit"
    >
      <Image
        src={product.image}
        alt={product.name}
        className="bg-white items-center justify-center flex rounded-[40px] w-full aspect-square object-cover shadow-lg"
        width={500}
        height={500}
        loading="lazy"
      />
      <div className="flex flex-col gap-1">
        <p className="text-center justify-start text-foreground text-3xl font-black">
          {product.name}
        </p>
        <p className="text-center justify-start text-foreground text-2xl font-semibold">
          {product.price} ₽
        </p>
      </div>
    </Link>
  );
};
