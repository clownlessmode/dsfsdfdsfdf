"use client";

import { IProduct } from "@entities/product";
import { Button } from "@shared/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Minus,
  Plus,
  X,
} from "lucide-react";
import NextImage from "next/image";
import React from "react";
import { InfoModal } from "./info-modal";
import { AnimatePresence, motion } from "framer-motion";

export const MakeSweet = ({
  product,
  isOpen,
  setIsOpen,
  extrasCount,
  setExtrasCount,
  removedIngredients,
  setRemovedIngredients,
  totalPrice,
  onAddToCart,
}: {
  product: IProduct;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  extrasCount: Record<number, number>;
  setExtrasCount: (
    count:
      | Record<number, number>
      | ((prev: Record<number, number>) => Record<number, number>)
  ) => void;
  removedIngredients: Set<number>;
  setRemovedIngredients: (
    ingredients: Set<number> | ((prev: Set<number>) => Set<number>)
  ) => void;
  totalPrice: number;
  onAddToCart: () => void;
}) => {
  const [isRendered, setIsRendered] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) setIsRendered(true);
  }, [isOpen]);

  // Micro page-like transition
  const easingInOut = [0.22, 1, 0.36, 1] as const;
  const contentVariants = {
    initial: { opacity: 0, y: 18, scale: 0.985 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.22, ease: easingInOut },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.99,
      transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
    },
  } as const;
  const sectionVariants = {
    animate: {
      transition: {
        staggerChildren: 0.015,
        delayChildren: 0.04,
      },
    },
  } as const;
  const itemVariants = {
    initial: { opacity: 0, y: 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.18, ease: easingInOut },
    },
    exit: { opacity: 0, y: 6, transition: { duration: 0.12 } },
  } as const;
  const priceQtySwap = {
    initial: { opacity: 0, y: 6 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.14, ease: easingInOut },
    },
    exit: { opacity: 0, y: -6, transition: { duration: 0.12 } },
  } as const;

  const toggleRemoved = (id: number) => {
    setRemovedIngredients((prev: Set<number>) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const incrementQuantity = (id: number) => {
    setExtrasCount((prev: Record<number, number>) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  };

  const decrementQuantity = (id: number) => {
    setExtrasCount((prev: Record<number, number>) => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, current - 1);
      const updated = { ...prev, [id]: next };
      return updated;
    });
  };

  const handleCardClick = (id: number) => {
    setExtrasCount((prev: Record<number, number>) => {
      const current = prev[id] ?? 0;
      return { ...prev, [id]: current + 1 };
    });
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="absolute top-20 left-20 w-[600px] flex flex-col bg-black/30 backdrop-blur-xl px-[32px] py-[24px] gap-2 rounded-[50px] text-white text-2xl font-bold cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex flex-row justify-between items-center">
              <p className="text-[32px] font-semibold">
                Хотите что то добавить?
              </p>
              <ChevronRight className="size-[32px] mt-1" />
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="text-[24px] font-normal leading-tight">
                Добавьте или удалите
                <br />
                ингридиенты по вашему вкусу
              </p>
              <div className="flex flex-row -space-x-[35px]">
                {product.extras?.slice(0, 2).map((ingredient) => (
                  <NextImage
                    loading="eager"
                    priority={true}
                    key={ingredient.id}
                    src={ingredient.image ?? null}
                    alt={ingredient.name ?? ""}
                    className="w-[70px] aspect-square object-cover"
                    width={500}
                    height={500}
                  />
                ))}
                {product.extras?.length && product.extras?.length > 2 && (
                  <div className="bg-primary rounded-full size-[70px] flex items-center justify-center">
                    <p className="text-[20px] font-bold mr-2">
                      +{(product.extras?.length ?? 0) - 2}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(isOpen || isRendered) && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-white/10 backdrop-blur-2xl"
            onClick={() => setIsOpen(false)}
          />
          <AnimatePresence
            initial={false}
            onExitComplete={() => setIsRendered(false)}
          >
            {isOpen && (
              <motion.div
                role="dialog"
                aria-modal="true"
                className="relative z-10 w-full h-full px-[48px] will-change-transform will-change-opacity"
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col w-full ">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="h-30 flex items-end justify-center"
                  >
                    <ChevronUp className="size-[72px] text-white" />
                  </button>
                </div>
                <motion.div
                  className="flex flex-col"
                  variants={sectionVariants}
                  initial={false}
                  animate="animate"
                >
                  <motion.h1
                    className="text-[90px] font-black text-white tracking-tighter font-inter"
                    variants={itemVariants}
                  >
                    Настрой для себя
                  </motion.h1>
                  <motion.div
                    className="grid grid-cols-4 gap-4"
                    variants={sectionVariants}
                  >
                    {product.extras?.map((ingredient) => {
                      const qty = extrasCount[ingredient.id] ?? 0;
                      const selected = qty > 0;
                      return (
                        <motion.div
                          key={ingredient.id}
                          variants={itemVariants}
                          className={`flex flex-col justify-between h-[380px] ${
                            selected ? "bg-black/20" : "bg-black/10"
                          } backdrop-blur-xl rounded-[50px] p-[25px]`}
                          onClick={() => handleCardClick(ingredient.id)}
                          whileTap={{ scale: 0.985 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          <div className="flex flex-col gap-1">
                            <NextImage
                              loading="eager"
                              priority={true}
                              src={ingredient.image}
                              alt={ingredient.name ?? ""}
                              width={100}
                              height={100}
                              className="rounded-[50px] w-full  object-cover"
                            />
                            <h3 className="text-[40px] tracking-tighter mt-1 text-white leading-none text-center">
                              {ingredient.name}
                            </h3>
                          </div>
                          <div className="min-h-[56px] flex items-center justify-center">
                            <AnimatePresence initial={false} mode="wait">
                              {selected ? (
                                <motion.div
                                  key="qty"
                                  variants={priceQtySwap}
                                  initial="initial"
                                  animate="animate"
                                  exit="exit"
                                  className="flex flex-row items-center justify-center gap-6"
                                >
                                  <button
                                    className="bg-white/20 rounded-full p-3 text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      decrementQuantity(ingredient.id);
                                    }}
                                  >
                                    <Minus className="size-[36px]" />
                                  </button>
                                  <p className="text-[36px] text-white text-center font-bold min-w-12">
                                    {qty}
                                  </p>
                                  <button
                                    className="bg-white/20 rounded-full p-3 text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      incrementQuantity(ingredient.id);
                                    }}
                                  >
                                    <Plus className="size-[36px]" />
                                  </button>
                                </motion.div>
                              ) : (
                                <motion.p
                                  key="price"
                                  variants={priceQtySwap}
                                  initial="initial"
                                  animate="animate"
                                  exit="exit"
                                  className="text-[36px] text-white text-center font-bold "
                                >
                                  {ingredient.price ?? 0}₽
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  <motion.h1
                    className="text-[90px] font-black text-white tracking-tighter font-inter mt-10"
                    variants={itemVariants}
                  >
                    В составе
                  </motion.h1>
                  <motion.div
                    className="flex flex-row flex-wrap gap-4"
                    variants={sectionVariants}
                  >
                    {product.ingredients?.map((ingredient, index) => {
                      const removed = removedIngredients.has(index);
                      return (
                        <motion.button
                          key={index}
                          variants={itemVariants}
                          onClick={() => toggleRemoved(index)}
                          className={`bg-black/10 backdrop-blur-xl flex items-center rounded-[50px] py-[20px] px-[60px] gap-2 text-white text-[36px] font-semibold tracking-tighter transition-opacity ${
                            removed ? "opacity-50" : "opacity-100"
                          }`}
                          whileTap={{ scale: 0.97 }}
                        >
                          <span className={`${removed ? "line-through" : ""}`}>
                            {ingredient}
                          </span>
                          <X className="size-[36px] -mb-1" />
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </motion.div>
                <div className="flex flex-row items-center justify-between w-full absolute bottom-0 left-0 py-[60px] px-[48px]">
                  <Button
                    className="aspect-square"
                    size={"lg"}
                    variant={"ghost"}
                    onClick={() => setIsOpen(false)}
                  >
                    <ChevronLeft className="size-[72px] -ml-2" />
                  </Button>

                  <div className="flex flex-row gap-5">
                    <InfoModal product={product} />
                    <Button size={"lg"} onClick={onAddToCart}>
                      +{totalPrice} ₽
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
