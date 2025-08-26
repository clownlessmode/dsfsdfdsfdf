import { mock } from "../config";

export class AdvertisementService {
  static async getAdvertisements() {
    // const response = await fetch("/api/advertisements");
    // return response.json();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mock;
  }
}
