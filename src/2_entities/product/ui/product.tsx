import Image from "next/image";
import React from "react";
import { IProduct } from "../config";
import Link from "next/link";
import { Skeleton } from "@shared/ui/skeleton";
import { Button } from "@shared/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@shared/lib/utils";

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
    <>
      {product.variant === "big" ? (
        <Link
          href={`/catalogue/${product.id}`}
          className={cn(
            "col-span-2 row-span-2 w-full h-full grid  items-center gap-5 py-5 px-4 pb-0"
          )}
          style={{ gridTemplateColumns: "auto 1fr auto" }}
        >
          <Image
            src={product.image}
            alt={product.name}
            className=" items-center justify-center flex w-full aspect-square object-cover "
            width={500}
            height={500}
            loading="lazy"
          />
          <div className="flex-col gap-2">
            <h1 className="text-[48px] font-bold tracking-tighter">
              {product.name}
            </h1>
            <p className="text-[32px] font-semibold tracking-tighter leading-[32px] text-muted-foreground">
              {product.information?.description}
            </p>
          </div>
          <div className="flex flex-row gap-5 items-center">
            <Button size="sm">
              <Plus className="size-[24px]" strokeWidth={2.5} />
              {product.price} ₽
            </Button>
            {product.oldPrice && (
              <div className="relative">
                <p className="text-center justify-start text-2xl text-muted-foreground font-semibold">
                  {product.oldPrice} ₽
                </p>
                <svg
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  width="79"
                  height="31"
                  viewBox="0 0 79 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 29L6.27046 27.0261C26.2615 17.7858 48.0218 13 70.0451 13H77"
                    stroke="#E40046"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </Link>
      ) : (
        <Link
          href={`/catalogue/${product.id}`}
          className={cn(
            "flex flex-col h-[400px] w-full justify-between items-center"
          )}
        >
          <div className="flex flex-col gap-1">
            <Image
              src={product.image}
              alt={product.name}
              className=" items-center justify-center flex w-[260px] aspect-square object-cover "
              width={500}
              height={500}
              loading="lazy"
            />
            <p className="text-center justify-start text-foreground text-3xl font-black">
              {product.name}
            </p>
          </div>
          {product.oldPrice && (
            <div className="relative">
              <p className="text-center justify-start text-2xl text-muted-foreground font-semibold">
                {product.oldPrice} ₽
              </p>
              <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                width="79"
                height="31"
                viewBox="0 0 79 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 29L6.27046 27.0261C26.2615 17.7858 48.0218 13 70.0451 13H77"
                  stroke="#E40046"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
          <Button size="sm">
            <Plus className="size-[24px]" strokeWidth={2.5} />
            {product.price} ₽
          </Button>
        </Link>
      )}
    </>
  );
};
