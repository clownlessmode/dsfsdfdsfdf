import React from "react";
import { IProductExtras } from "../config/types";
import Image from "next/image";
import { Button } from "@shared/ui/button";
import { Minus, Plus } from "lucide-react";

interface Props {
  ingredient: IProductExtras;
  count?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}
export const Ingredient = ({
  ingredient,
  count = 0,
  onIncrement,
  onDecrement,
}: Props) => {
  return (
    <div className="flex flex-col gap-8 bg-white rounded-[60px] p-[25px] items-center">
      <div className="flex flex-col bg-white rounded-[60px] items-center w-full">
        <Image
          loading="eager"
          priority={true}
          src={ingredient.image ?? null}
          alt={ingredient.name ?? ""}
          width={100}
          className="rounded-[50px] w-full h-[300px] object-cover"
          height={100}
        />
        <h3 className="text-[40px] font-bold leading-none mt-4 max-w-[270px] text-center truncate">
          {ingredient.name}
        </h3>
        <p className="text-[25px] text-muted-foreground font-medium">
          {ingredient.description} {ingredient.price && ` ${ingredient.price}₽`}
        </p>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <Button
          variant="outline"
          className=" rounded-full bg-none size-12 !text-foreground border-foreground border-4 opacity-80"
          onClick={() => onDecrement?.()}
          disabled={count <= 0}
        >
          <Minus className="size-6" />
        </Button>
        <p className="text-5xl font-bold leading-none">{count}</p>
        <Button
          variant="outline"
          className=" rounded-full  bg-none size-12 !text-foreground  border-foreground border-4 opacity-80"
          onClick={() => onIncrement?.()}
        >
          <Plus className="size-6" />
        </Button>
      </div>
    </div>
  );
};
