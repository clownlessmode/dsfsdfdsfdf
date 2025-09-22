"use client";

import {
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@shared/ui/button";
import { useCart } from "@entities/cart/model/store";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const SplashProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { clearCart } = useCart();
  const [isIdleDialogOpen, setIsIdleDialogOpen] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const IDLE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes
  const lastActivityRef = useRef<number>(Date.now());
  const [, setNow] = useState<number>(Date.now());
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const disabled = pathname === "/";

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    lastActivityRef.current = Date.now();
    if (disabled) return;
    idleTimerRef.current = setTimeout(() => {
      setIsIdleDialogOpen(true);
    }, IDLE_TIMEOUT_MS);
  }, [IDLE_TIMEOUT_MS, disabled]);

  useEffect(() => {
    if (disabled) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setIsIdleDialogOpen(false);
      return;
    }
    const activityHandler = () => {
      resetIdleTimer();
    };
    resetIdleTimer();
    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("mousedown", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("touchstart", activityHandler, { passive: true });
    window.addEventListener("scroll", activityHandler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("mousedown", activityHandler);
      window.removeEventListener("keydown", activityHandler);
      window.removeEventListener("touchstart", activityHandler);
      window.removeEventListener("scroll", activityHandler);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer, disabled]);

  // ticker to update visible idle time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStay = () => {
    setIsIdleDialogOpen(false);
    resetIdleTimer();
  };

  const handleLeave = useCallback(() => {
    setIsIdleDialogOpen(false);
    clearCart();
    router.push("/");
  }, [clearCart, router]);

  // Auto-confirm "Нет" after 10 seconds if dialog stays open
  useEffect(() => {
    if (disabled) return;
    if (confirmTimerRef.current) {
      clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
    }
    if (isIdleDialogOpen) {
      confirmTimerRef.current = setTimeout(() => {
        handleLeave();
      }, 10000);
    }
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    };
  }, [isIdleDialogOpen, disabled, handleLeave]);

  // Удаляем неиспользуемые переменные

  return (
    <>
      {children}
      {!disabled && (
        <AnimatePresence>
          {isIdleDialogOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 shadow-2xl"
              onClick={() => setIsIdleDialogOpen(false)}
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
                className="fixed shadow-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[60px] z-50 p-6 text-center flex flex-col"
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
                  className="text-[72px] font-bold mb-4 text-center w-full leading-[72px] text-balance"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Продолжить собирать заказ?
                </motion.h2>

                <motion.div
                  className="flex flex-row gap-6 justify-center items-center mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    // className="!px-20 text-[32px] h-[80px]"
                    size={"lg"}
                    className="w-full"
                    onClick={handleStay}
                  >
                    Да
                  </Button>
                  <Button
                    variant="outline"
                    // className="!px-20 text-[32px] h-[80px]"
                    size={"lg"}
                    className="w-full"
                    onClick={handleLeave}
                  >
                    Нет
                  </Button>
                </motion.div>

                <motion.button
                  className="absolute top-10 right-10 bg-muted rounded-full p-5 hover:bg-muted/80 transition-colors"
                  onClick={() => setIsIdleDialogOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <X className="size-[48px] text-foreground/80" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};
