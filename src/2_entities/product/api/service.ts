import { mock } from "../config";

export class ProductService {
  static async getProducts() {
    // const response = await fetch("/api/products");
    // return response.json();
    if (process.env.NODE_ENV !== "production") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return mock;
  }

  static async getProduct(id: number) {
    // const response = await fetch(`/api/products/${id}&`);
    // return response.json();
    if (process.env.NODE_ENV !== "production") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return mock.find((product) => product.id === Number(id));
  }
}
