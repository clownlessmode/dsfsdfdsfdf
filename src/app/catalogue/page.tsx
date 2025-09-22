import { ICategoryResponse } from "@entities/category";
import React from "react";
import CatalogueBrowser from "./catalogue-browser";
import { IProduct } from "@entities/product";

export const dynamic = "force-dynamic";
export const revalidate = 0; // No caching

const getProducts = async (): Promise<IProduct[]> => {
  try {
    const timestamp = Date.now();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product-main?_cb=${timestamp}&_force_reload=true`,
      {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

const getCategories = async (): Promise<ICategoryResponse> => {
  try {
    const timestamp = Date.now();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/groups?_cb=${timestamp}&_force_reload=true`,
      {
        credentials: "include",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { data: [], success: false };
  }
};

const CataloguePage = async () => {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return <CatalogueBrowser categories={categories.data} products={products} />;
};
export default CataloguePage;
