import Image from "next/image";
import React from "react";
import { IProduct } from "../config";
import Link from "next/link";

import { Button } from "@shared/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@shared/lib/utils";

interface IProps {
  product: IProduct;
}

export const Product = ({ product }: IProps) => {
  return (
    <>
      {product.variant === "big" ? (
        <Link
          id={product.id.toString()}
          href={`/catalogue/${product.id}`}
          className={cn(
            "col-span-2 row-span-2 w-full h-full grid grid-cols-1 items-center gap-5 py-5 px-4 pb-0"
          )}
        >
          <Image
            loading="eager"
            priority={true}
            src={product.image ?? null}
            alt={product.name}
            className=" items-center justify-center flex w-full aspect-square object-cover "
            width={500}
            height={500}
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
              {product.type?.length && product.type?.length > 1
                ? `от ${product.type?.[0].price} ₽`
                : product.type?.[0].price}{" "}
              ₽
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
            "flex flex-col h-[360px] w-full justify-between items-center"
          )}
        >
          <div className="flex flex-col gap-1">
            <Image
              loading="eager"
              priority={true}
              src={product.image ?? null}
              alt={product.name}
              className=" items-center justify-center flex w-[260px] aspect-square object-cover "
              width={500}
              height={500}
            />
            <p className="text-center justify-start text-foreground text-3xl font-black leading-none">
              {product.name}
            </p>
          </div>
          {/* {product.oldPrice && (
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
          )} */}
          <Button size="sm" className="mt-auto">
            {product.type?.length && product.type?.length > 1 ? (
              `от ${product.type?.[0].price} ₽`
            ) : (
              <>
                <Plus className="size-[24px]" strokeWidth={2.5} />
                {product.type?.[0].price} ₽
              </>
            )}
          </Button>
        </Link>
      )}
    </>
  );
};
