import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartStore, CartItem } from "../config";

const useCartStore = create<CartStore>()(
  persist<CartStore>(
    (set): CartStore => ({
      cart: { items: [] },
      setCart: (cart: Cart) => set({ cart }),
      addCartItem: (item: CartItem) =>
        set((state) => ({
          cart: {
            items: [...(state.cart?.items ?? []), item],
          },
        })),
      removeCartItem: (itemId: string) =>
        set((state) => {
          const items = state.cart?.items ?? [];
          const itemIndex = items.findIndex((item) => {
            const id = `${item.product.id}-${
              item.selectedType?.id || "default"
            }-${JSON.stringify(item.extras)}-${Array.from(
              item.removedIngredients
            )
              .sort()
              .join(",")}`;
            return id === itemId;
          });

          if (itemIndex === -1) return state;

          const newItems = [...items];
          newItems.splice(itemIndex, 1);

          return {
            cart: {
              items: newItems,
            },
          };
        }),
      increaseCartItemQuantity: (itemId: string) =>
        set((state) => {
          const items = state.cart?.items ?? [];
          const itemIndex = items.findIndex((item) => {
            const id = `${item.product.id}-${
              item.selectedType?.id || "default"
            }-${JSON.stringify(item.extras)}-${Array.from(
              item.removedIngredients
            )
              .sort()
              .join(",")}`;
            return id === itemId;
          });

          if (itemIndex === -1) return state;

          const newItems = [...items];
          const updatedItem = { ...newItems[itemIndex] };
          updatedItem.quantity += 1;
          updatedItem.totalPrice =
            updatedItem.quantity * (updatedItem.selectedType?.price || 0);
          newItems[itemIndex] = updatedItem;

          return {
            cart: {
              items: newItems,
            },
          };
        }),
      decreaseCartItemQuantity: (itemId: string) =>
        set((state) => {
          const items = state.cart?.items ?? [];
          const itemIndex = items.findIndex((item) => {
            const id = `${item.product.id}-${
              item.selectedType?.id || "default"
            }-${JSON.stringify(item.extras)}-${Array.from(
              item.removedIngredients
            )
              .sort()
              .join(",")}`;
            return id === itemId;
          });

          if (itemIndex === -1) return state;

          const newItems = [...items];
          const updatedItem = { ...newItems[itemIndex] };

          // Если количество больше 1, уменьшаем на 1
          if (updatedItem.quantity > 1) {
            updatedItem.quantity -= 1;
            updatedItem.totalPrice =
              updatedItem.quantity * (updatedItem.selectedType?.price || 0);
            newItems[itemIndex] = updatedItem;
          } else {
            // Если количество равно 1, удаляем товар полностью
            newItems.splice(itemIndex, 1);
          }

          return {
            cart: {
              items: newItems,
            },
          };
        }),
      clearCart: () => set({ cart: { items: [] } }),
      getTotalPrice: () => {
        const state = useCartStore.getState();
        return (
          state.cart?.items?.reduce(
            (total, item) => total + item.totalPrice,
            0
          ) ?? 0
        );
      },
      getTotalItems: () => {
        const state = useCartStore.getState();
        return state.cart?.items?.length ?? 0;
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
  const addCartItem = useCartStore((s) => s.addCartItem);
  const removeCartItem = useCartStore((s) => s.removeCartItem);
  const increaseCartItemQuantity = useCartStore(
    (s) => s.increaseCartItemQuantity
  );
  const decreaseCartItemQuantity = useCartStore(
    (s) => s.decreaseCartItemQuantity
  );
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotalPrice = useCartStore((s) => s.getTotalPrice);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  return {
    cart,
    setCart,
    addCartItem,
    removeCartItem,
    increaseCartItemQuantity,
    decreaseCartItemQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
};
