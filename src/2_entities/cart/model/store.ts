import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartStore } from "../config";
import { IProduct } from "@entities/product/config/types";

const useCartStore = create<CartStore>()(
  persist<CartStore>(
    (set): CartStore => ({
      cart: { products: [] },
      setCart: (cart: Cart) => set({ cart }),
      addProduct: (product: IProduct) =>
        set((state) => ({
          cart: {
            products: [...(state.cart?.products ?? []), product],
          },
        })),
      removeProduct: (product: IProduct) =>
        set((state) => {
          const products = state.cart?.products ?? [];
          const productIndex = products.findIndex((p) => p.id === product.id);

          if (productIndex === -1) return state;

          const newProducts = [...products];
          newProducts.splice(productIndex, 1);

          return {
            cart: {
              products: newProducts,
            },
          };
        }),
      clearCart: () => set({ cart: { products: [] } }),
      getProductCount: (productId: number) => {
        const state = useCartStore.getState();
        return (
          state.cart?.products?.filter((p) => p.id === productId).length ?? 0
        );
      },
      getTotalPrice: () => {
        const state = useCartStore.getState();
        return (
          state.cart?.products?.reduce(
            (total, product) => total + product.price,
            0
          ) ?? 0
        );
      },
      getTotalItems: () => {
        const state = useCartStore.getState();
        return state.cart?.products?.length ?? 0;
      },
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
  const getProductCount = useCartStore((s) => s.getProductCount);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  return {
    cart,
    setCart,
    addProduct,
    removeProduct,
    clearCart,
    getProductCount,
    getTotalPrice,
    getTotalItems,
  };
};
