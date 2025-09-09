"use client";

import type React from "react";
import { forwardRef } from "react";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { cn } from "@shared/lib/utils";

interface NumberKeypadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /**
   * Значение хранится в «сыром» виде: только цифры, например 79990000000
   */
  value?: string;
  /**
   * В onChange отдаем «сырые» цифры: 7XXXXXXXXXX
   */
  onChange?: (value: string) => void;
  /**
   * Максимальная длина «сырых» цифр (по умолчанию 11 для РФ)
   */
  maxLength?: number;
  className?: string;
  placeholder?: string;
}

const DEFAULT_MAX_LEN = 11;

// Нормализуем «сырые» цифры под российский формат: всегда начинаем с 7
const normalizePhoneDigits = (
  raw: string,
  maxLen = DEFAULT_MAX_LEN
): string => {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  let out = digits;

  if (out[0] === "8") {
    out = "7" + out.slice(1);
  } else if (out[0] !== "7") {
    out = "7" + out;
  }

  return out.slice(0, maxLen);
};

// Форматируем для отображения: +7 (999) 000 00-00 (частично по мере ввода)
const formatPhoneDisplay = (raw: string, maxLen = DEFAULT_MAX_LEN): string => {
  const normalized = normalizePhoneDigits(raw, maxLen);
  if (!normalized) return "";
  const rest = normalized.slice(1); // 10 оставшихся цифр

  let out = "+7";

  if (rest.length > 0) {
    out += " (" + rest.slice(0, Math.min(3, rest.length));
    if (rest.length >= 3) out += ")";
  }
  if (rest.length > 3) {
    out += " " + rest.slice(3, Math.min(6, rest.length));
  }
  if (rest.length > 6) {
    out += " " + rest.slice(6, Math.min(8, rest.length));
  }
  if (rest.length > 8) {
    out += "-" + rest.slice(8, Math.min(10, rest.length));
  }

  return out;
};

// Применяем нажатую клавишу к «сырым» цифрам
const applyKeyToRaw = (
  raw: string,
  key: string,
  maxLen = DEFAULT_MAX_LEN
): string => {
  const digitsOnly = (raw || "").replace(/\D/g, "");

  if (key === "C") return "";
  if (key === "⌫") {
    if (!digitsOnly) return "";
    const next = digitsOnly.slice(0, -1);
    // если осталась одна "7" — очищаем полностью
    return next === "7" ? "" : next;
  }

  if (!/^\d$/.test(key)) return digitsOnly;

  // Первая цифра
  if (!digitsOnly) {
    if (key === "8" || key === "7") return "7";
    return "7" + key;
  }

  // Остальные цифры
  if (digitsOnly.length >= maxLen) return digitsOnly;
  return normalizePhoneDigits(digitsOnly + key, maxLen);
};

const NumericKeyboard = forwardRef<HTMLInputElement, NumberKeypadProps>(
  (
    { value = "", onChange, maxLength, className, placeholder, ...props },
    ref
  ) => {
    const maxLen = maxLength ?? DEFAULT_MAX_LEN;

    const handleKeyPress = (key: string) => {
      if (!onChange) return;
      const newRaw = applyKeyToRaw(value, key, maxLen);
      onChange({ target: { value: newRaw } } as never); // RHF happy now
    };

    const keys = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["C", "0", "⌫"],
    ];

    const display = formatPhoneDisplay(value, maxLen);

    return (
      <div className={cn("flex flex-col gap-6 items-center", className)}>
        <Input
          ref={ref}
          value={display}
          placeholder={placeholder || "+7"}
          readOnly
          type="tel"
          className="pointer-events-none shadow-lg "
          {...props}
        />

        <div className="grid grid-cols-3 gap-3 w-fit bg-background p-10 rounded-[60px] shadow-lg">
          {keys.map((row, rowIndex) =>
            row.map((key, keyIndex) => (
              <Button
                key={`${rowIndex}-${keyIndex}`}
                onClick={() => handleKeyPress(key)}
                type="button"
                className="bg-muted text-foreground"
              >
                {key}
              </Button>
            ))
          )}
        </div>
      </div>
    );
  }
);

NumericKeyboard.displayName = "NumericKeyboard";

export { NumericKeyboard };
