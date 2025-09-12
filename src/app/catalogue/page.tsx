import { ICategoryResponse } from "@entities/category";
import React from "react";
import CatalogueBrowser from "./catalogue-browser";
import { IProduct } from "@entities/product";

export const dynamic = "force-static";
export const revalidate = 1800; // 30 minutes

const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await fetch(
      "http://localhost:3006/api/foodcord/product-main",
      {
        credentials: "include",
      }
    );
    return response.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};

const getCategories = async (): Promise<ICategoryResponse> => {
  try {
    const response = await fetch("http://localhost:3006/api/foodcord/groups", {
      credentials: "include",
    });
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
