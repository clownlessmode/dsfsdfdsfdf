"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter?: () => void;
  onSpace: () => void;
  className?: string;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onEnter,
  onSpace,
  className,
}) => {
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);

  const numberRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const numberRowShift = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

  const firstRow = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  const secondRow = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  const thirdRow = ["z", "x", "c", "v", "b", "n", "m"];

  const symbolKeys = ["-", "=", "[", "]", "\\", ";", "'", ",", ".", "/"];
  const symbolKeysShift = ["_", "+", "{", "}", "|", ":", '"', "<", ">", "?"];

  const handleKeyPress = useCallback(
    (key: string) => {
      let finalKey = key;

      if (key.match(/[a-z]/)) {
        if (isShiftPressed || isCapsLock) {
          finalKey = key.toUpperCase();
        }
      }

      onKeyPress(finalKey);

      // Сбрасываем Shift после нажатия (кроме CapsLock)
      if (isShiftPressed && !isCapsLock) {
        setIsShiftPressed(false);
      }
    },
    [isShiftPressed, isCapsLock, onKeyPress]
  );

  const handleShiftPress = useCallback(() => {
    setIsShiftPressed(!isShiftPressed);
  }, [isShiftPressed]);

  const handleCapsLockPress = useCallback(() => {
    setIsCapsLock(!isCapsLock);
    setIsShiftPressed(false);
  }, [isCapsLock]);

  const getSymbolKey = (index: number) => {
    return isShiftPressed ? symbolKeysShift[index] : symbolKeys[index];
  };

  const getNumberKey = (index: number) => {
    return isShiftPressed ? numberRowShift[index] : numberRow[index];
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t rounded-t-lg p-4 sm:p-6 shadow-lg z-50",
        "max-w-full overflow-x-auto",
        className
      )}
    >
      {/* Цифровой ряд */}
      <div className="flex gap-2 mb-3 justify-center min-w-fit">
        {numberRow.map((num, index) => (
          <Button
            key={num}
            variant="outline"
            size="sm"
            type="button"
            className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 text-2xl sm:text-4xl font-medium bg-background/50"
            onClick={() => handleKeyPress(getNumberKey(index))}
          >
            <div className="flex flex-col items-center">
              {isShiftPressed ? (
                <>
                  <span className="text-base sm:text-xl">{num}</span>
                  <span className="text-2xl sm:text-4xl">
                    {numberRowShift[index]}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-base sm:text-xl">
                    {numberRowShift[index]}
                  </span>
                  <span className="text-2xl sm:text-4xl">{num}</span>
                </>
              )}
            </div>
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[80px] sm:min-w-[100px] h-12 sm:h-16 bg-background/50 text-2xl sm:text-4xl"
          onClick={onBackspace}
        >
          ⌫
        </Button>
      </div>

      {/* Первый ряд букв */}
      <div className="flex gap-2 mb-3 justify-center min-w-fit">
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[70px] sm:min-w-[90px] h-12 sm:h-16 bg-background/50 text-xl sm:text-2xl"
          onClick={() => handleKeyPress("\t")}
        >
          Tab
        </Button>
        {firstRow.map((letter) => (
          <Button
            key={letter}
            variant="outline"
            size="sm"
            type="button"
            className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50 text-2xl sm:text-4xl"
            onClick={() => handleKeyPress(letter)}
          >
            {isShiftPressed || isCapsLock ? letter.toUpperCase() : letter}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(2))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[2]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[2]}</span>
          </div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(3))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[3]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[3]}</span>
          </div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(4))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[4]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[4]}</span>
          </div>
        </Button>
      </div>

      {/* Второй ряд букв */}
      <div className="flex gap-2 mb-3 justify-center min-w-fit">
        <Button
          variant={isCapsLock ? "default" : "outline"}
          size="sm"
          type="button"
          className="min-w-[80px] sm:min-w-[100px] h-12 sm:h-16 text-xl sm:text-2xl"
          onClick={handleCapsLockPress}
        >
          Caps
        </Button>
        {secondRow.map((letter) => (
          <Button
            key={letter}
            variant="outline"
            size="sm"
            type="button"
            className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50 text-2xl sm:text-4xl"
            onClick={() => handleKeyPress(letter)}
          >
            {isShiftPressed || isCapsLock ? letter.toUpperCase() : letter}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(5))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[5]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[5]}</span>
          </div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(6))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[6]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[6]}</span>
          </div>
        </Button>
        {onEnter && (
          <Button
            variant="outline"
            size="sm"
            type="button"
            className="min-w-[80px] sm:min-w-[100px] h-12 sm:h-16 bg-background/50 text-xl sm:text-2xl"
            onClick={onEnter}
          >
            Enter
          </Button>
        )}
      </div>

      {/* Третий ряд букв */}
      <div className="flex gap-2 mb-3 justify-center min-w-fit">
        <Button
          variant={isShiftPressed ? "default" : "outline"}
          size="sm"
          type="button"
          className="min-w-[90px] sm:min-w-[120px] h-12 sm:h-16 text-xl sm:text-2xl"
          onClick={handleShiftPress}
        >
          Shift
        </Button>
        {thirdRow.map((letter) => (
          <Button
            key={letter}
            variant="outline"
            size="sm"
            type="button"
            className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50 text-2xl sm:text-4xl"
            onClick={() => handleKeyPress(letter)}
          >
            {isShiftPressed || isCapsLock ? letter.toUpperCase() : letter}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(7))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[7]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[7]}</span>
          </div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(8))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[8]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[8]}</span>
          </div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(9))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[9]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[9]}</span>
          </div>
        </Button>
      </div>

      {/* Нижний ряд */}
      <div className="flex gap-2 justify-center min-w-fit">
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[80px] sm:min-w-[100px] h-12 sm:h-16 bg-background/50 text-xl sm:text-2xl"
          onClick={() => handleKeyPress("ctrl")}
        >
          Ctrl
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[70px] sm:min-w-[100px] h-12 sm:h-16 bg-background/50 text-xl sm:text-2xl"
          onClick={() => handleKeyPress("alt")}
        >
          Alt
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[200px] sm:min-w-[300px] h-12 sm:h-16 bg-background/50 text-xl sm:text-2xl"
          onClick={onSpace}
        >
          Space
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(0))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[0]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[0]}</span>
          </div>
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className="min-w-[60px] sm:min-w-[80px] h-12 sm:h-16 bg-background/50"
          onClick={() => handleKeyPress(getSymbolKey(1))}
        >
          <div className="flex flex-col items-center">
            <span className="text-base sm:text-xl">{symbolKeysShift[1]}</span>
            <span className="text-2xl sm:text-4xl">{symbolKeys[1]}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
