"use client";
import { Button } from "@shared/ui/button";
import { Info, X } from "lucide-react";
import React from "react";
import { IProduct } from "@entities/product";
import { motion, AnimatePresence } from "framer-motion";

interface InfoModalProps {
  product: IProduct | null;
}

export const InfoModal = ({ product }: InfoModalProps) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <Button
        className="aspect-square"
        size={"lg"}
        variant={"ghost"}
        onClick={handleOpen}
      >
        <Info className="size-[72px]" />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={handleClose}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 50,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 50,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="fixed bottom-[250px] left-1/2 -translate-x-1/2 bg-white rounded-[60px]  z-50 p-6 text-center flex flex-col"
              style={{
                backgroundColor: "white",
                borderRadius: "60px",
                zIndex: 50,
                padding: "50px",
                width: "910px",
                margin: "0 1rem",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.h2
                className="text-[72px] font-bold mb-4 text-left w-full leading-[72px]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                О продукте
              </motion.h2>

              {product && product.information && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-[32px] text-left w-full mt-6 first-letter:capitalize lowercase">
                    {product.information.composition}
                  </p>
                  <p className="text-[32px] text-left w-full text-muted-foreground mt-2 lowercase">
                    {product.information.gramm}
                  </p>
                </motion.div>
              )}

              <motion.div
                className="flex flex-row gap-15"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col gap-0">
                  <p className="text-[32px] text-left w-full font-semibold mt-8">
                    Энергия
                  </p>
                  <p className="text-[32px] text-left w-full text-muted-foreground">
                    {product?.information?.calories} ккал
                  </p>
                </div>
                <div className="flex flex-col gap-0">
                  <p className="text-[32px] text-left w-full font-semibold mt-8">
                    Углеводы
                  </p>
                  <p className="text-[32px] text-left w-full text-muted-foreground lowercase">
                    {product?.information?.carbohydrates} г
                  </p>
                </div>
                <div className="flex flex-col gap-0">
                  <p className="text-[32px] text-left w-full font-semibold mt-8">
                    Белки
                  </p>
                  <p className="text-[32px] text-left w-full text-muted-foreground lowercase">
                    {product?.information?.proteins} г
                  </p>
                </div>
                <div className="flex flex-col gap-0">
                  <p className="text-[32px] text-left w-full font-semibold mt-8">
                    Жиры
                  </p>
                  <p className="text-[32px] text-left w-full text-muted-foreground lowercase">
                    {product?.information?.fats} г
                  </p>
                </div>
              </motion.div>

              <motion.button
                className="absolute top-10 right-10 bg-muted rounded-full p-5 hover:bg-muted/80 transition-colors"
                onClick={handleClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <X className="size-[48px] text-foreground/80" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
