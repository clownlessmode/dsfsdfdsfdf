/**
 * Плюрализация для русского языка
 * @param count - количество
 * @param form1 - форма для 1 (например: "товар")
 * @param form2 - форма для 2-4 (например: "товара")
 * @param form5 - форма для 5+ (например: "товаров")
 * @returns правильная форма слова
 */
export function pluralize(
  count: number,
  form1: string,
  form2: string,
  form5: string
): string {
  const absCount = Math.abs(count);
  const lastDigit = absCount % 10;
  const lastTwoDigits = absCount % 100;

  // Исключения для чисел от 11 до 19
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return form5;
  }

  // Для чисел, оканчивающихся на 1 (кроме 11)
  if (lastDigit === 1) {
    return form1;
  }

  // Для чисел, оканчивающихся на 2, 3, 4 (кроме 12, 13, 14)
  if (lastDigit >= 2 && lastDigit <= 4) {
    return form2;
  }

  // Для всех остальных случаев (0, 5-9)
  return form5;
}
