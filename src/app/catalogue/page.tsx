import React from "react";
import CatalogueBrowser from "./catalogue-browser";
import type { IProduct } from "@entities/product";
import type { ICategory, ICategoryResponse } from "@entities/category";
import { cookies } from "next/headers";

export const revalidate = 3600;

async function getCategories(): Promise<ICategory[]> {
  const cookieStore = await cookies();
  const idStore = cookieStore.get("foodcort_store_id")?.value;
  if (!idStore || !process.env.NEXT_PUBLIC_API_URL) {
    console.warn("[catalogue:getCategories] Missing context", {
      hasIdStore: Boolean(idStore),
      hasApiBaseUrl: Boolean(process.env.NEXT_PUBLIC_API_URL),
    });
    return [];
  }
  const url = `${process.env.NEXT_PUBLIC_API_URL}/groups/get-all-group-per-store/${idStore}`;
  const res = await fetch(url, {
    credentials: "include",
    next: { revalidate: revalidate, tags: ["catalogue", "categories"] },
  });
  if (!res.ok) {
    const bodySnippet = (await res.text()).slice(0, 300);
    console.error("[catalogue:getCategories] Non-OK response", {
      url,
      status: res.status,
      statusText: res.statusText,
      idStore,
      bodySnippet,
    });
    return [];
  }
  const json = (await res.json()) as ICategoryResponse;
  return json?.data ?? [];
}

async function getProducts(): Promise<IProduct[]> {
  const cookieStore = await cookies();
  const idStore = cookieStore.get("foodcort_store_id")?.value;
  if (!idStore || !process.env.NEXT_PUBLIC_API_URL) {
    console.warn("[catalogue:getProducts] Missing context", {
      hasIdStore: Boolean(idStore),
      hasApiBaseUrl: Boolean(process.env.NEXT_PUBLIC_API_URL),
    });
    return [];
  }
  const url = `${process.env.NEXT_PUBLIC_API_URL}/product-main/find-all-product-per-store/${idStore}`;
  const res = await fetch(url, {
    credentials: "include",
    next: { revalidate: revalidate, tags: ["catalogue", "products"] },
  });
  if (!res.ok) {
    const bodySnippet = (await res.text()).slice(0, 300);
    console.error("[catalogue:getProducts] Non-OK response", {
      url,
      status: res.status,
      statusText: res.statusText,
      idStore,
      bodySnippet,
    });
    return [];
  }
  const json = (await res.json()) as unknown as
    | IProduct[]
    | { data?: IProduct[] };
  const products = Array.isArray(json) ? json : json?.data ?? [];

  return products;
}

const CataloguePage = async () => {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return <CatalogueBrowser categories={categories} products={products} />;
};

export default CataloguePage;