"use client";
import { X } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSelectMethod: (method: string) => void;
}

export const CheckoutModal = ({
  open,
  onClose,
  onSelectMethod,
}: CheckoutModalProps) => {
  const handleClose = () => onClose();

  const handleMethodSelect = (method: string) => {
    onSelectMethod(method);
    handleClose();
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
              Способ получения
            </motion.h2>

            <motion.div
              className="flex flex-col gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="self-stretch inline-flex justify-start items-start gap-12">
                <div
                  className="flex-1 inline-flex flex-col justify-center items-center gap-7 cursor-pointer active:scale-95 transition-all duration-300"
                  onClick={() => handleMethodSelect("self-service")}
                >
                  <div className="self-stretch h-72 p-2.5 relative bg-stone-100 rounded-[60px]  outline-offset-[-1px]inline-flex justify-center items-center gap-2.5 overflow-hidden">
                    <Image
                      loading="eager"
                      src="/foodcord-terminal/receiving-method/on-the-plate.png"
                      alt="На подносе"
                      width={391}
                      height={391}
                    />
                  </div>
                  <div className="self-stretch text-center justify-start text-yellow-950 text-4xl font-semibold font-['IBM_Plex_Sans']">
                    На подносе
                  </div>
                </div>
                <div
                  className="flex-1 inline-flex flex-col justify-center items-center gap-7 cursor-pointer active:scale-95 transition-all duration-300"
                  onClick={() => handleMethodSelect("delivery")}
                >
                  <div className="self-stretch h-72 p-2.5 relative bg-stone-100 rounded-[60px] inline-flex justify-center items-center gap-2.5 overflow-hidden">
                    <Image
                      loading="eager"
                      src="/foodcord-terminal/receiving-method/in-a-bag.png"
                      alt="В пакете"
                      width={412}
                      height={412}
                    />
                  </div>
                  <div className="self-stretch text-center justify-start text-yellow-950 text-4xl font-semibold font-['IBM_Plex_Sans']">
                    В пакете
                  </div>
                </div>
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
  );
};
