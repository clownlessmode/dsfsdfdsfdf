"use client";
import { useAdvertisementsController } from "@entities/advertisement/api";
import { AdvertisementCard } from "@entities/advertisement/ui/advertisement-card";
import { Category } from "@entities/category";
import { useCategoriesController } from "@entities/category/api";
import { useProductsController } from "@entities/product/api";
import { Product } from "@entities/product/ui/product";
import React from "react";

const CataloguePage = () => {
  const { advertisements } = useAdvertisementsController();
  const { categories } = useCategoriesController();
  const { products } = useProductsController();
  return (
    <main className="flex flex-col h-screen overflow-hidden p-20 gap-10 bg-muted justify-start">
      <AdvertisementCard
        advertisements={advertisements ?? []}
        className="h-[340px]"
      />
      <div className="grid grid-cols-5 gap-8 flex-1 min-h-0">
        <div className="col-span-1 h-full flex flex-col gap-8 overflow-y-auto">
          {categories?.map((category) => (
            <Category key={category.id} category={category} />
          ))}
        </div>
        <div className="flex flex-col gap-8 col-span-4 min-h-0">
          <h1 className="text-7xl font-black">Напитки</h1>
          <div className="flex flex-row w-full col-span-4 gap-4">
            <div className="shadow-lg px-7 py-3 bg-primary text-white text-4xl font-black w-full rounded-full inline-flex justify-center items-center gap-2.5">
              Все
            </div>
            <div className="shadow-lg px-7 py-3 bg-background text-4xl font-black w-full rounded-full inline-flex justify-center items-center gap-2.5">
              Холодные
            </div>
            <div className="shadow-lg px-7 py-3 bg-background text-4xl font-black w-full rounded-full inline-flex justify-center items-center gap-2.5">
              Горячие
            </div>
          </div>
          <div className="col-span-4 grid grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-auto">
            {products?.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
export default CataloguePage;
