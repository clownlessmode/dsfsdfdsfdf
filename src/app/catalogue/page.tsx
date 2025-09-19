import { ICategoryResponse } from "@entities/category";
import React from "react";
import CatalogueBrowser from "./catalogue-browser";
import { IProduct } from "@entities/product";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product-main`,
      {
        credentials: "include",
      }
    );
    console.log(response.json);

    return response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

const getCategories = async (): Promise<ICategoryResponse> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`, {
      credentials: "include",
    });
    console.log(response.json);

    return response.json();
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
