"use client";
import Image from "next/image";
import React from "react";
import { CategoryCard } from "./category-card";
import { categories, products } from "./constants";
import { ProductCard } from "./product-card";

const CataloguePage = () => {
  return (
    <main className="flex h-screen flex-col p-20 overflow-hidden gap-10">
      <Image
        alt=""
        src={"/burger.png"}
        width={1080}
        height={1920}
        className="w-full h-48 md:h-64 object-cover rounded-4xl"
        priority
      />

      {/* Контейнер с двумя колонками должен уметь сжиматься: min-h-0 */}
      <div className="flex flex-1 min-h-0 gap-4 w-full">
        {/* Левая колонка - категории */}
        <div className="flex w-fit shrink-0 flex-col gap-1 items-center overflow-y-auto min-h-0">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              image={category.image}
            />
          ))}
        </div>

        <div className="flex flex-col gap-6 w-full items-start">
          <h1 className=" text-[#444444] text-[67px] font-black">Напитки</h1>
          <div className="flex flex-row gap-4">
            <div className="px-[27px] py-[13px] bg-[#d93333] rounded-[100px] inline-flex justify-center items-center gap-2.5">
              <div className="justify-start text-white text-4xl font-black">
                Все
              </div>
            </div>
            <div className="px-[27px] py-[13px] bg-[#eeeeee] rounded-[100px] inline-flex justify-center items-center gap-2.5">
              <div className="justify-start text-[#444444] text-4xl font-black">
                Холодные
              </div>
            </div>
            <div className="px-[27px] py-[13px] bg-[#eeeeee] rounded-[100px] inline-flex justify-center items-center gap-2.5">
              <div className="justify-start text-[#444444] text-4xl font-black">
                Горячие
              </div>
            </div>
          </div>
          {/* Правая колонка - каталог */}
          <div className="grid grid-cols-2 gap-8 gap-y-10 items-start overflow-y-auto min-h-0 w-full">
            {products.map((product) => (
              <ProductCard
                key={product.title}
                title={product.title}
                image={product.image}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CataloguePage;
