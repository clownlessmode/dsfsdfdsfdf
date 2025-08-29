import { IProduct } from "@entities/product/config/types";

export interface Cart {
  products: IProduct[];
}

export enum ReceivingMethod {
  ON_THE_PLATE = "on-the-plate",
  IN_A_BAG = "in-a-bag",
}

export interface CartStore {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  addProduct: (product: IProduct) => void;
  removeProduct: (product: IProduct) => void;
  clearCart: () => void;
}
