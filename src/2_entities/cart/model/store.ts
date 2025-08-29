import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartStore } from "../config";
import { IProduct } from "@entities/product/config/types";

const useCartStore = create<CartStore>()(
  persist<CartStore>(
    (set) => ({
      cart: { products: [] },
      setCart: (cart: Cart) => set({ cart }),
      addProduct: (product: IProduct) =>
        set((state) => ({
          cart: {
            products: [...(state.cart?.products ?? []), product],
          },
        })),
      removeProduct: (product: IProduct) =>
        set((state) => ({
          cart: {
            products:
              state.cart?.products?.filter((p) => p.id !== product.id) ?? [],
          },
        })),
      clearCart: () => set({ cart: { products: [] } }),
    }),
    {
      name: "cart",
    }
  )
);

export const useCart = () => {
  const cart = useCartStore((s) => s.cart);
  const setCart = useCartStore((s) => s.setCart);
  const addProduct = useCartStore((s) => s.addProduct);
  const removeProduct = useCartStore((s) => s.removeProduct);
  const clearCart = useCartStore((s) => s.clearCart);
  return { cart, setCart, addProduct, removeProduct, clearCart };
};
