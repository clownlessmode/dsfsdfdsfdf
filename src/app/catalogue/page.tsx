import React from "react";
import CatalogueBrowser from "./catalogue-browser";
import type { IProduct } from "@entities/product";
import type { ICategory, ICategoryResponse } from "@entities/category";

export const revalidate = 3600;

async function getCategories(): Promise<ICategory[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`, {
    credentials: "include",
    next: { revalidate: 3600, tags: ["catalogue", "categories"] },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as ICategoryResponse;
  return json?.data ?? [];
}

async function getProducts(): Promise<IProduct[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-main`, {
    credentials: "include",
    next: { revalidate: 3600, tags: ["catalogue", "products"] },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as unknown as
    | IProduct[]
    | { data?: IProduct[] };
  return Array.isArray(json) ? json : json?.data ?? [];
}

const CataloguePage = async () => {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return <CatalogueBrowser categories={categories} products={products} />;
};

export default CataloguePage;
