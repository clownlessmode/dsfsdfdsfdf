import { mock as productsMock } from "@entities/product";
import { mock as categoriesMock } from "@entities/category";
import React from "react";
import CatalogueBrowser from "./catalogue-browser";

const getProducts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return productsMock;
};

const getCategories = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
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
