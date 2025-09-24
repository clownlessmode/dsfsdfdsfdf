"use client";

import React, { useMemo } from "react";
import { ICategory } from "@entities/category/config";
import { IProduct } from "@entities/product/config";
import { Logotype } from "@shared/ui/logotype";
import { Category } from "@entities/category";
import { CartButton, CartRow, useCart } from "@entities/cart";
import { Product } from "@entities/product";
import { useCategoryScrollSync } from "./use-category-scroll-sync";

const CatalogueBrowser = ({
  categories,
  products,
}: {
  categories: ICategory[];
  products: IProduct[];
}) => {
  const { cart } = useCart();

  const {
    selectedCategory,
    scrollContainerRef,
    headingRefs,
    handleCategoryClick,
  } = useCategoryScrollSync(categories, { offset: 80, suppressMs: 800 });

  const productsByCategory = useMemo(() => {
    const map = new Map<number, IProduct[]>();
    categories.forEach((c) => map.set(c.id, []));
    products.forEach((product) => {
      product.groups.forEach((group) => {
        if (!map.has(group.id)) map.set(group.id, []);
        map.get(group.id)!.push(product);
      });
    });
    return map;
  }, [categories, products]);
  return (
    <main className="flex flex-col h-screen px-5 pt-10 pb-5 gap-5 overflow-hidden">
      <Logotype theme="dark" />
      <div className="flex flex-col gap-2.5 bg-[#F5F5F5] min-h-0 flex-1 rounded-[30px] p-2.5 overflow-hidden">
        <div className="flex flex-row gap-2.5 bg-[#F5F5F5] min-h-0 flex-1 rounded-[30px] overflow-hidden">
          <section className="flex flex-col gap-1 py-2 bg-white rounded-[20px] w-[200px] flex-none min-h-0 overflow-y-auto h-full items-center">
            {categories.map((category) => (
              <Category
                key={category.id}
                category={category}
                isActive={selectedCategory?.id === category.id}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </section>
          <section className="flex flex-col gap-1 py-2 bg-white rounded-[20px] flex-1 min-h-0 relative">
            <div
              ref={scrollContainerRef}
              className="flex-1 min-h-0 overflow-y-auto"
            >
              {categories.map((category) => {
                const items = productsByCategory.get(category.id) ?? [];
                if (items.length === 0) return null;
                return (
                  <div key={category.id} className="pb-6">
                    <h2
                      ref={(el) => {
                        headingRefs.current.set(category.id, el);
                      }}
                      data-category-id={category.id}
                      className="font-bold text-5xl tracking-tighter pl-5 mt-[32px]"
                    >
                      {category.name}
                    </h2>
                    <div className="grid grid-cols-3 gap-x-6 mt-2.5 p-2.5 items-stretch gap-y-[32px]">
                      {items.map((product) => (
                        <Product key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
        {cart?.items?.length && cart?.items?.length > 0 ? (
          <div className="flex flex-row justify-between gap-2.5 bg-white rounded-[30px] px-[18px] py-[7px]">
            <CartRow />
            <CartButton />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default CatalogueBrowser;
