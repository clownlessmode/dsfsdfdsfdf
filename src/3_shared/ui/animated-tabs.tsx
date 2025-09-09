"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@shared/lib/utils";

interface TabItem {
  id: string;
  name: string;
  price?: number;
}

interface AnimatedTabsProps {
  items: TabItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  inactiveTextColor?: string;
  activeTextColor?: string;
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
}

export const AnimatedTabs = ({
  items,
  selectedId,
  onSelect,
  className = "",
  itemClassName = "",
  activeItemClassName = "bg-primary",
  inactiveTextColor = "hsl(0, 0%, 20%)",
  activeTextColor = "white",
  itemWidth = 300,
  itemHeight = 160, // h-40 = 160px
  gap = 8,
}: AnimatedTabsProps) => {
  if (!items || items.length <= 1) return null;

  return (
    <div
      className={cn(
        "relative p-1 rounded-full backdrop-blur-2xl flex justify-between items-center",
        className
      )}
    >
      {/* Анимированный фон для активного элемента */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            className={cn("absolute rounded-full", activeItemClassName)}
            initial={false}
            animate={{
              x:
                items.findIndex((item) => item.id === selectedId) *
                (itemWidth + gap),
              width: itemWidth,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
            }}
            style={{
              height: itemHeight,
            }}
          />
        )}
      </AnimatePresence>

      {/* Элементы табов */}
      {items.map((item) => (
        <motion.div
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            "relative flex items-center flex-col justify-center leading-[32px] px-[40px] text-[40px] font-bold rounded-full cursor-pointer z-10 transition-colors duration-300",
            itemClassName,
            selectedId === item.id && "!text-white"
          )}
          style={{
            color: selectedId === item.id ? activeTextColor : inactiveTextColor,
            minWidth: itemWidth,
            height: itemHeight,
          }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
        >
          {item.name}
          {item.price && (
            <span className="text-[28px] opacity-60 leading-[28px]">
              {item.price} ₽
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
};
