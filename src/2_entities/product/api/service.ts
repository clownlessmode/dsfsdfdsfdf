import { mock } from "../config";

export class ProductService {
  static async getProducts() {
    // const response = await fetch("/api/products");
    // return response.json();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mock;
  }
}
