import { CartItem } from "@entities/cart/config/types";

export interface OrderProduct {
  id: number;
  count: number;
  comment: string;
}

export interface CreateOrderRequest {
  products: OrderProduct[];
  idStore: number;
  phoneNumber: number;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}

/**
 * Создает заказ через API
 */
export const createOrder = async (
  request: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  try {
    const response = await fetch("http://localhost:3006/api/foodcord/orders", {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      orderId: data.orderId,
      message: "Заказ успешно создан",
    };
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    return {
      success: false,
      message: "Ошибка при создании заказа",
    };
  }
};

/**
 * Преобразует товары из корзины в формат API
 */
export const transformCartItemsToOrderProducts = (
  cartItems: CartItem[]
): OrderProduct[] => {
  return cartItems.map((item) => {
    // Создаем комментарий из удаленных ингредиентов
    const removedIngredients = Array.from(item.removedIngredients)
      .map((ingredientIndex) => item.product.ingredients[ingredientIndex])
      .filter(Boolean);

    const comment =
      removedIngredients.length > 0
        ? `Убрать: ${removedIngredients.join(", ")}`
        : "";

    return {
      id: item.selectedType?.id || item.product.id,
      count: item.quantity,
      comment,
    };
  });
};

/**
 * Форматирует номер телефона для API (убирает +7, 8, пробелы, скобки, дефисы)
 */
export const formatPhoneNumber = (phone: string): number => {
  // Убираем все символы кроме цифр
  const digitsOnly = phone.replace(/\D/g, "");

  // Убираем +7 или 8 в начале
  let cleanNumber = digitsOnly;
  if (cleanNumber.startsWith("7") && cleanNumber.length === 11) {
    cleanNumber = cleanNumber.substring(1);
  } else if (cleanNumber.startsWith("8") && cleanNumber.length === 11) {
    cleanNumber = cleanNumber.substring(1);
  }

  return parseInt(cleanNumber, 10);
};
