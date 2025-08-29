"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CartButton } from "@entities/cart";
import { Category } from "@entities/category";
import type { ICategory } from "@entities/category/config";
import { Product as ProductCard } from "@entities/product/ui/product";
import type { IProduct } from "@entities/product/config";

interface CatalogueBrowserProps {
  categories: ICategory[];
  products: IProduct[];
}

export const CatalogueBrowser = ({
  categories,
  products,
}: CatalogueBrowserProps) => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(
    () => {
      const firstWithProducts = categories.find((category) =>
        products.some((product) => product.group?.includes(category.id))
      );
      return firstWithProducts?.id ?? categories[0]?.id;
    }
  );
  const [selectedSubgroup, setSelectedSubgroup] = useState<string | undefined>(
    undefined
  );

  const productsContainerRef = useRef<HTMLDivElement | null>(null);

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedGroupId);
  }, [categories, selectedGroupId]);

  const uniqueSubgroups = useMemo(() => {
    if (!selectedGroupId) return [] as string[];
    const subgroups = products
      .filter((p) => p.group?.includes(selectedGroupId))
      .flatMap((p) => (Array.isArray(p.subgroup) ? p.subgroup : []))
      .filter(Boolean);
    return Array.from(new Set(subgroups));
  }, [products, selectedGroupId]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const inGroup = selectedGroupId
        ? p.group?.includes(selectedGroupId)
        : true;
      const inSub = selectedSubgroup
        ? p.subgroup?.includes(selectedSubgroup)
        : true;
      return Boolean(inGroup && inSub);
    });
  }, [products, selectedGroupId, selectedSubgroup]);

  useEffect(() => {
    if (productsContainerRef.current) {
      productsContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedGroupId, selectedSubgroup]);

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
    setSelectedSubgroup(undefined);
  };

  const handleSelectSubgroup = (subgroup?: string) => {
    setSelectedSubgroup(subgroup);
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden p-10 gap-10 bg-muted justify-start">
      <footer className="absolute bottom-10 right-10">
        <CartButton />
      </footer>
      <div className="grid grid-cols-5 gap-8 flex-1 min-h-0">
        <div className="col-span-1 h-full flex flex-col gap-8 overflow-y-auto px-2 py-4">
          {categories?.map((category) => (
            <motion.div
              key={category.id}
              onClick={() => handleSelectGroup(category.id)}
              className="cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  mass: 0.2,
                }}
                className={
                  "w-full rounded-[40px] pb-5 transition-all duration-300 " +
                  (category.id === selectedGroupId
                    ? "scale-[1.1] bg-background shadow-lg"
                    : "")
                }
              >
                <Category category={category} />
              </motion.div>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col gap-8 col-span-4 min-h-0">
          <motion.h1
            key="catalogue-title"
            className="text-7xl font-black"
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {selectedCategory?.name ?? "Категория"}
          </motion.h1>
          <div className="flex flex-row w-full col-span-4 gap-4">
            <motion.button
              onClick={() => handleSelectSubgroup(undefined)}
              className={
                (selectedSubgroup == null
                  ? "bg-primary text-white "
                  : "bg-background ") +
                "shadow-lg px-7 py-3 text-4xl font-black w-full rounded-full inline-flex justify-center items-center gap-2.5"
              }
              whileTap={{ scale: 0.98 }}
              layout
            >
              Все
            </motion.button>
            {uniqueSubgroups.map((sub) => (
              <motion.button
                key={sub}
                onClick={() => handleSelectSubgroup(sub)}
                className={
                  (selectedSubgroup === sub
                    ? "bg-primary text-white "
                    : "bg-background ") +
                  "shadow-lg px-7 py-3 text-4xl font-black w-full rounded-full inline-flex justify-center items-center gap-2.5"
                }
                whileTap={{ scale: 0.98 }}
                layout
              >
                {sub}
              </motion.button>
            ))}
          </div>
          <div
            ref={productsContainerRef}
            className="col-span-4 grid grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-auto"
          >
            <AnimatePresence initial={false}>
              {filteredProducts?.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="h-fit break-inside-avoid mb-8"
                >
                  <ProductCard product={product} isLoading={false} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CatalogueBrowser;
