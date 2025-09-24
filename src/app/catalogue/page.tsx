"use client";

import React, { useEffect, useMemo, useState } from "react";
import CatalogueBrowser from "./catalogue-browser";
import type { IProduct } from "@entities/product";
import type { ICategory, ICategoryResponse } from "@entities/category";
import { useCatalogueCache } from "./catalogue-cache";
import { safeFetchJson } from "@shared/lib/safe-fetch";

const CataloguePage = () => {
  const { categories, products, setCatalogueData, hasHydrated } =
    useCatalogueCache();
  const [loading, setLoading] = useState(false);

  const shouldFetch =
    hasHydrated && (categories.length === 0 || products.length === 0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!shouldFetch) return;
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        safeFetchJson<ICategoryResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/groups`
        ),
        safeFetchJson<IProduct[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/product-main`
        ),
      ]);

      if (!cancelled) {
        setCatalogueData({
          categories: catRes.success ? catRes.data?.data ?? [] : [],
          products: prodRes.success ? (prodRes.data as IProduct[]) ?? [] : [],
        });
        setLoading(false);
      }
    };
    if (!hasHydrated) return;
    load();
    return () => {
      cancelled = true;
    };
  }, [shouldFetch, setCatalogueData, hasHydrated]);

  const memoCategories: ICategory[] = useMemo(() => categories, [categories]);
  const memoProducts: IProduct[] = useMemo(() => products, [products]);

  if (loading && shouldFetch) return null;

  return (
    <CatalogueBrowser categories={memoCategories} products={memoProducts} />
  );
};

export default CataloguePage;
