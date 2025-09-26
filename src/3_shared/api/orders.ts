import { CartItem } from "@entities/cart/config/types";

export interface OrderProductInclude {
  id: number;
  name: string;
  price: number;
  count: number;
}

export interface OrderProduct {
  id: number;
  name: string;
  price: number;
  count: number;
  include: OrderProductInclude[];
  exclude: string;
}

export interface CreateOrderRequest {
  products: OrderProduct[];
  idStore: number;
  phoneNumber: number;
  receivingMethod: "self_service" | "delivery";
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
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
    // Базовая цена единицы товара (без учёта допов)
    const unitPrice = item.selectedType?.price || 0;

    // Создаем массив включенных допов (extras)
    const include: OrderProductInclude[] = Object.keys(item.extras)
      .filter((extraId) => item.extras[parseInt(extraId)] > 0)
      .map((extraId) => {
        const extra = item.product.extras?.find(
          (e) => e.id.toString() === extraId
        );
        return {
          id: parseInt(extraId),
          name: extra?.name || `Доп ${extraId}`,
          price: extra?.price ?? 0, // цена за единицу допа
          count: item.extras[parseInt(extraId)],
        };
      });

    // Создаем строку исключенных ингредиентов
    const removedIngredients = Array.from(item.removedIngredients)
      .map(
        (ingredientId) =>
          item.product.ingredients.find((ing) => ing.id === ingredientId)?.name
      )
      .filter(Boolean);

    const exclude =
      removedIngredients.length > 0
        ? `Убрать: ${removedIngredients.join(", ")}`
        : "";

    return {
      id: item.selectedType?.id || item.product.id,
      name: item.product.name,
      price: unitPrice, // цена за единицу товара без допов
      count: item.quantity,
      include,
      exclude,
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
