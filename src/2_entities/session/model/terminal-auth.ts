"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TerminalAuthState {
  authorized: boolean;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  authorize: () => void;
  deauthorize: () => void;
  logout: () => void; // Explicit logout that clears everything
}

export const useTerminalAuth = create<TerminalAuthState>()(
  persist(
    (set) => ({
      authorized: false,
      hasHydrated: false,
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
      authorize: () => set({ authorized: true }),
      deauthorize: () => set({ authorized: false }),
      logout: () => {
        // Clear auth state
        set({ authorized: false });
        // Clear session data
        try {
          localStorage.removeItem("session");
          localStorage.removeItem("terminal-auth-storage");
        } catch {
          console.warn("Failed to clear session data during logout");
        }
      },
    }),
    {
      name: "terminal-auth-storage",
      // Сохраняем только состояние авторизации
      partialize: (state) => ({ authorized: state.authorized }),
      // More resilient storage handling
      storage: {
        getItem: (name) => {
          try {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch {
            // If localStorage fails, continue without error
            console.warn("Failed to save auth state to localStorage");
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch {
            // If localStorage fails, continue without error
            console.warn("Failed to remove auth state from localStorage");
          }
        },
      },
      onRehydrateStorage: () => {
        return (state) => {
          // Флаг гидрации для предотвращения ложных редиректов
          state?.setHasHydrated?.(true);
        };
      },
    }
  )
);
