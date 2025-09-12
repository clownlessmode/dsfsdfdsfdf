import { IProduct, IProductType } from "@entities/product/config/types";

export interface CartItem {
  product: IProduct;
  selectedType: IProductType | null;
  quantity: number;
  extras: Record<number, number>; // ingredientId -> quantity
  removedIngredients: Set<number>; // ingredientId set
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
}

export enum ReceivingMethod {
  ON_THE_PLATE = "on-the-plate",
  IN_A_BAG = "in-a-bag",
}

export interface CartStore {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  addCartItem: (item: CartItem) => void;
  removeCartItem: (itemId: string) => void;
  increaseCartItemQuantity: (itemId: string) => void;
  decreaseCartItemQuantity: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
