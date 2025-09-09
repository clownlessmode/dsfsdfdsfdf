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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { useCart } from "@entities/cart/model/store";

export const SplashProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { clearCart } = useCart();
  const [isIdleDialogOpen, setIsIdleDialogOpen] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const IDLE_TIMEOUT_MS = 20 * 60 * 1000; // 2 minutes
  const lastActivityRef = useRef<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());
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

  const formatMs = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const elapsedMs = Math.min(now - lastActivityRef.current, IDLE_TIMEOUT_MS);

  return (
    <>
      {children}
      {!disabled && (
        <div className="fixed top-5 right-5 z-[100000]">
          <div className="bg-white text-black rounded-full px-5 py-2 shadow-lg border border-black/10 text-2xl font-bold">
            <span className="tabular-nums">
              {formatMs(elapsedMs)} / {formatMs(IDLE_TIMEOUT_MS)}
            </span>
          </div>
        </div>
      )}
      {!disabled && (
        <Dialog open={isIdleDialogOpen} onOpenChange={setIsIdleDialogOpen}>
          <DialogContent className="w-[920px] !max-w-none rounded-[60px] h-fit">
            <DialogHeader>
              <DialogTitle className="text-5xl">
                Продолжить собирать заказ?
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-row gap-6 justify-center items-center">
              <Button className="!px-20" onClick={handleStay}>
                Да
              </Button>
              <Button
                variant="outline"
                className="!px-20"
                onClick={handleLeave}
              >
                Нет
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
