import { mock } from "../config";

export class CategoryService {
  static async getCategories() {
    // const response = await fetch("/api/categories");
    // return response.json();
    if (process.env.NODE_ENV !== "production") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return mock;
  }
}
