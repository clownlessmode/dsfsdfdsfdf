import React from "react";
import CatalogueBrowser from "./catalogue-browser";
import type { IProduct } from "@entities/product";
import type { ICategory, ICategoryResponse } from "@entities/category";
import { cookies } from "next/headers";

export const revalidate = 3600;

async function getCategories(): Promise<ICategory[]> {
  try {
    const cookieStore = await cookies();
    const idStore = cookieStore.get("foodcort_store_id")?.value;
    if (!idStore) return [];
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/get-all-group-per-store/${idStore}`, {
      credentials: "include",
      next: { revalidate: revalidate, tags: ["catalogue", "categories"] },
    });
    if (!res.ok) return [];
    
    const text = await res.text();
    if (!text) return [];
    
    const json = JSON.parse(text) as ICategoryResponse;
    return json?.data ?? [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getProducts(): Promise<IProduct[]> {
  try {
    const cookieStore = await cookies();
    const idStore = cookieStore.get("foodcort_store_id")?.value;
    if (!idStore) return [];
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-main/find-all-product-per-store/${idStore}`, {
      credentials: "include",
      next: { revalidate: revalidate, tags: ["catalogue", "products"] },
    });
    if (!res.ok) return [];
    
    const text = await res.text();
    if (!text) return [];
    const json = JSON.parse(text) as unknown as IProduct[] | { data?: IProduct[] };
    return Array.isArray(json) ? json : json?.data ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

const CataloguePage = async () => {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return <CatalogueBrowser categories={categories} products={products} />;
};

export default CataloguePage;
