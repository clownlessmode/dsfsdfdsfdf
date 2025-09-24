"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TerminalAuthState {
  authorized: boolean;
  hasHydrated: boolean;
  authorize: () => void;
  deauthorize: () => void;
}

export const useTerminalAuth = create<TerminalAuthState>()(
  persist(
    (set) => ({
      authorized: false,
      hasHydrated: false,
      authorize: () => set({ authorized: true }),
      deauthorize: () => set({ authorized: false }),
    }),
    {
      name: "terminal-auth-storage",
      // Сохраняем только состояние авторизации
      partialize: (state) => ({ authorized: state.authorized }),
      onRehydrateStorage: () => {
        return () => {
          // Флаг гидрации для предотвращения ложных редиректов
          set({ hasHydrated: true });
        };
      },
    }
  )
);
