import React from "react";
import CatalogueBrowser from "./catalogue-browser";
import type { IProduct } from "@entities/product";
import type { ICategory, ICategoryResponse } from "@entities/category";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const revalidate = 3600;
const API_BASE_URLS = [
  process.env.API_INTERNAL_URL,
  process.env.NEXT_PUBLIC_API_URL,
].filter((v, i, arr): v is string => Boolean(v) && arr.indexOf(v) === i);

async function getCategories(): Promise<ICategory[]> {
  const cookieStore = await cookies();
  const idStore = cookieStore.get("foodcort_store_id")?.value;
  if (!idStore || API_BASE_URLS.length === 0) {
    return [];
  }
  for (const baseUrl of API_BASE_URLS) {
    try {
      const res = await fetch(
        `${baseUrl}/groups/get-all-group-per-store/${idStore}`,
        {
          credentials: "include",
          next: { revalidate: revalidate, tags: ["catalogue", "categories"] },
        }
      );

      if (!res.ok || res.status === 204) continue;

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) continue;

      const json = (await res.json()) as ICategoryResponse;
      const list = Array.isArray(json?.data) ? json.data : [];
      if (list.length > 0) return list;
    } catch (error) {
      console.error(`Failed to fetch categories from ${baseUrl}:`, error);
    }
  }
  return [];
}

async function getProducts(): Promise<IProduct[]> {
  const cookieStore = await cookies();
  const idStore = cookieStore.get("foodcort_store_id")?.value;
  if (!idStore || API_BASE_URLS.length === 0) {
    return [];
  }
  for (const baseUrl of API_BASE_URLS) {
    try {
      const res = await fetch(
        `${baseUrl}/product-main/find-all-product-per-store/${idStore}`,
        {
          credentials: "include",
          next: { revalidate: revalidate, tags: ["catalogue", "products"] },
        }
      );

      if (!res.ok || res.status === 204) continue;

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) continue;

      const json = (await res.json()) as unknown as
        | IProduct[]
        | { data?: IProduct[] };
      const list = Array.isArray(json) ? json : json?.data;
      if (Array.isArray(list) && list.length > 0) return list;
    } catch (error) {
      console.error(`Failed to fetch products from ${baseUrl}:`, error);
    }
  }
  return [];
}

const CataloguePage = async () => {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return <CatalogueBrowser categories={categories} products={products} />;
};

export default CataloguePage;