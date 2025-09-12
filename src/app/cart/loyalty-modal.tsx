"use client";
import { Button } from "@shared/ui/button";
import { X } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NumericKeyboard } from "@shared/ui/numeric-keyboard";

interface LoyaltyModalProps {
  open: boolean;
  onClose: () => void;
}

export const LoyaltyModal = ({ open, onClose }: LoyaltyModalProps) => {
  const [phoneNumber, setPhoneNumber] = React.useState("");

  const handleClose = () => {
    setPhoneNumber(""); // Очищаем поле при закрытии
    onClose();
  };

  const handleApply = () => {
    if (phoneNumber.length >= 11) {
      // Здесь можно добавить логику обработки номера телефона
      console.log("Применяем номер:", phoneNumber);
      handleClose();
    } else {
      // Можно добавить уведомление о неполном номере
      console.log("Номер слишком короткий");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/20"
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
            className="fixed bottom-[250px] left-1/2 -translate-x-1/2 bg-white rounded-[60px] z-50 p-6 text-center flex flex-col"
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
              Карта лояльности
            </motion.h2>

            <motion.div
              className="flex flex-col gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-left">
                <p className="text-[32px] text-muted-foreground mb-4">
                  Введите номер телефона
                </p>
                <NumericKeyboard
                  value={phoneNumber || ""}
                  onChange={setPhoneNumber}
                />
              </div>
            </motion.div>

            <motion.div
              className="flex flex-row gap-4 mt-8 justify-center w-full items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClose}
              >
                Отмена
              </Button>
              <Button
                className="w-full"
                onClick={handleApply}
                disabled={phoneNumber.length < 11}
              >
                Применить
              </Button>
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
  );
};
