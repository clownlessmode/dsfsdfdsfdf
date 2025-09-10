import { mock as productsMock } from "@entities/product";
import { mock as categoriesMock } from "@entities/category";
import React from "react";
import CatalogueBrowser from "./catalogue-browser";

export const dynamic = "force-static";
export const revalidate = 1800; // 30 minutes

const getProducts = async () => {
  if (process.env.NODE_ENV !== "production") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return productsMock;
};

const getCategories = async () => {
  if (process.env.NODE_ENV !== "production") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return categoriesMock;
};

// Advertisements are currently unused on catalogue page

const CataloguePage = async () => {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  return <CatalogueBrowser categories={categories} products={products} />;
};
export default CataloguePage;
