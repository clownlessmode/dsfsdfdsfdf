"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ICategory } from "@entities/category/config";
import type { IProduct } from "@entities/product/config";

type CatalogueState = {
  categories: ICategory[];
  products: IProduct[];
  hasHydrated: boolean;
  setCatalogueData: (payload: {
    categories?: ICategory[];
    products?: IProduct[];
  }) => void;
  clear: () => void;
};

export const useCatalogueCache = create<CatalogueState>()(
  persist(
    (set) => ({
      categories: [],
      products: [],
      hasHydrated: false,
      setCatalogueData: ({ categories, products }) =>
        set((prev) => ({
          categories: categories ?? prev.categories,
          products: products ?? prev.products,
        })),
      clear: () => set({ categories: [], products: [] }),
    }),
    {
      name: "catalogue-cache",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        categories: state.categories,
        products: state.products,
      }),
      onRehydrateStorage: () => () => {
        // Mark store as hydrated regardless of success; keep previous in-memory data if any
        useCatalogueCache.setState({ hasHydrated: true });
      },
    }
  )
);
