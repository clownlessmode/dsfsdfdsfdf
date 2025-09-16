import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartStore, CartItem } from "../config";

const useCartStore = create<CartStore>()(
  persist<CartStore>(
    (set): CartStore => ({
      cart: { items: [] },
      setCart: (cart: Cart) => set({ cart }),
      addCartItem: (item: CartItem) =>
        set((state) => {
          const items = state.cart?.items ?? [];

          // Генерируем ID для нового товара
          const newItemId = `${item.product.id}-${
            item.selectedType?.id || "default"
          }-${JSON.stringify(item.extras)}-${Array.from(item.removedIngredients)
            .sort()
            .join(",")}`;

          // Ищем существующий товар с таким же ID
          const existingItemIndex = items.findIndex((existingItem) => {
            const existingItemId = `${existingItem.product.id}-${
              existingItem.selectedType?.id || "default"
            }-${JSON.stringify(existingItem.extras)}-${Array.from(
              existingItem.removedIngredients
            )
              .sort()
              .join(",")}`;
            return existingItemId === newItemId;
          });

          if (existingItemIndex !== -1) {
            // Если товар уже существует, увеличиваем количество
            const newItems = [...items];
            const updatedItem = { ...newItems[existingItemIndex] };
            updatedItem.quantity += item.quantity;

            // Пересчитываем общую цену с учетом дополнений
            const unitPrice = updatedItem.selectedType?.price || 0;
            const extrasTotal =
              updatedItem.product.extras?.reduce((sum, extra) => {
                const count = updatedItem.extras[extra.id] ?? 0;
                return sum + count * (extra.price ?? 0);
              }, 0) ?? 0;

            updatedItem.totalPrice =
              updatedItem.quantity * (unitPrice + extrasTotal);
            newItems[existingItemIndex] = updatedItem;

            return {
              cart: {
                items: newItems,
              },
            };
          } else {
            // Если товар не существует, добавляем новый
            return {
              cart: {
                items: [...items, item],
              },
            };
          }
        }),
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

          // Пересчитываем общую цену с учетом дополнений
          const unitPrice = updatedItem.selectedType?.price || 0;
          const extrasTotal =
            updatedItem.product.extras?.reduce((sum, extra) => {
              const count = updatedItem.extras[extra.id] ?? 0;
              return sum + count * (extra.price ?? 0);
            }, 0) ?? 0;

          updatedItem.totalPrice =
            updatedItem.quantity * (unitPrice + extrasTotal);
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

            // Пересчитываем общую цену с учетом дополнений
            const unitPrice = updatedItem.selectedType?.price || 0;
            const extrasTotal =
              updatedItem.product.extras?.reduce((sum, extra) => {
                const count = updatedItem.extras[extra.id] ?? 0;
                return sum + count * (extra.price ?? 0);
              }, 0) ?? 0;

            updatedItem.totalPrice =
              updatedItem.quantity * (unitPrice + extrasTotal);
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
