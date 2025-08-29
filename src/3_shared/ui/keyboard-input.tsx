/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";
import { Button } from "@shared/ui/button";
import VirtualKeyboard from "./virtual-keyboard";
import { cn } from "@shared/lib/utils";
import type { UseFormReturn, FieldPath, FieldValues } from "react-hook-form";

interface UseVirtualKeyboardProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldName: FieldPath<T>;
}

export function useVirtualKeyboard<T extends FieldValues>({
  form,
  fieldName,
}: UseVirtualKeyboardProps<T>) {
  const currentValue = form.watch(fieldName) || "";

  const handleKeyPress = useCallback(
    (key: string) => {
      const newValue = currentValue + key;
      form.setValue(fieldName, newValue as any);
    },
    [currentValue, form, fieldName]
  );

  const handleBackspace = useCallback(() => {
    const newValue = currentValue.slice(0, -1);
    form.setValue(fieldName, newValue as any);
  }, [currentValue, form, fieldName]);

  const handleSpace = useCallback(() => {
    const newValue = currentValue + " ";
    form.setValue(fieldName, newValue as any);
  }, [currentValue, form, fieldName]);

  const handleEnter = useCallback(() => {
    const newValue = currentValue + "\n";
    form.setValue(fieldName, newValue as any);
  }, [currentValue, form, fieldName]);

  const handleClear = useCallback(() => {
    form.setValue(fieldName, "" as any);
  }, [form, fieldName]);

  return {
    handleKeyPress,
    handleBackspace,
    handleSpace,
    handleEnter,
    handleClear,
    currentValue,
  };
}

interface KeyboardInputProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  fieldName: FieldPath<T>;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  label?: string;
  showKeyboard?: boolean;
  onKeyboardToggle?: (show: boolean) => void;
}

export function KeyboardInput<T extends FieldValues>({
  form,
  fieldName,
  placeholder,
  multiline = false,
  className,
  label,
  showKeyboard: externalShowKeyboard,
  onKeyboardToggle,
}: KeyboardInputProps<T>) {
  const [internalShowKeyboard, setInternalShowKeyboard] = useState(false);

  const showKeyboard =
    externalShowKeyboard !== undefined
      ? externalShowKeyboard
      : internalShowKeyboard;
  const setShowKeyboard = onKeyboardToggle || setInternalShowKeyboard;

  const {
    handleKeyPress,
    handleBackspace,
    handleSpace,
    handleEnter,
    currentValue,
  } = useVirtualKeyboard({
    form,
    fieldName,
  });

  const toggleKeyboard = () => {
    setShowKeyboard(!showKeyboard);
  };

  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}

      <div className="relative">
        <InputComponent
          {...form.register(fieldName)}
          placeholder={placeholder}
          value={currentValue}
          onChange={(e) => form.setValue(fieldName, e.target.value as any)}
          className="pr-12"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          onClick={toggleKeyboard}
        >
          ⌨️
        </Button>
      </div>

      {showKeyboard && (
        <div className="mt-4">
          <VirtualKeyboard
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onSpace={handleSpace}
            onEnter={multiline ? handleEnter : undefined}
          />
        </div>
      )}
    </div>
  );
}
