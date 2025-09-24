"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TerminalAuthState {
  authorized: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  authorize: () => void;
  deauthorize: () => void;
}

export const useTerminalAuth = create<TerminalAuthState>()(
  persist(
    (set) => ({
      authorized: false,
      hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
      authorize: () => set({ authorized: true }),
      deauthorize: () => set({ authorized: false }),
    }),
    {
      name: "terminal-auth-storage",
      // Сохраняем только состояние авторизации
      partialize: (state) => ({ authorized: state.authorized }),
      onRehydrateStorage: () => {
        return (state) => {
          // Флаг гидрации для предотвращения ложных редиректов
          state?.setHasHydrated?.(true);
        };
      },
    }
  )
);
