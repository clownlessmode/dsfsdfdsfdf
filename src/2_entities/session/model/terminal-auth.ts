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
  checkAutoAuth: () => void; // Check if we should auto-authorize on startup
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
          sessionStorage.removeItem("session");
          sessionStorage.removeItem("terminal-auth-storage");
        } catch {
          console.warn("Failed to clear session data during logout");
        }
      },
      checkAutoAuth: () => {
        // Check if we have valid session data and should auto-authorize
        try {
          if (typeof window === "undefined" || !sessionStorage) return;

          const sessionData = sessionStorage.getItem("session");
          if (sessionData) {
            const parsed = JSON.parse(sessionData);
            const hasIdStore = parsed.state?.session?.idStore;
            if (hasIdStore) {
              set({ authorized: true });
            }
          }
        } catch (error) {
          console.warn("Failed to check auto-auth:", error);
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
            if (typeof window === "undefined" || !sessionStorage) return null;
            const item = sessionStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            if (typeof window === "undefined" || !sessionStorage) return;
            sessionStorage.setItem(name, JSON.stringify(value));
          } catch {
            // If sessionStorage fails, continue without error
            console.warn("Failed to save auth state to sessionStorage");
          }
        },
        removeItem: (name) => {
          try {
            if (typeof window === "undefined" || !sessionStorage) return;
            sessionStorage.removeItem(name);
          } catch {
            // If sessionStorage fails, continue without error
            console.warn("Failed to remove auth state from sessionStorage");
          }
        },
      },
      onRehydrateStorage: () => {
        return (state) => {
          // Флаг гидрации для предотвращения ложных редиректов
          state?.setHasHydrated?.(true);
          // Проверяем, нужно ли автоматически авторизовать пользователя
          state?.checkAutoAuth?.();
        };
      },
    }
  )
);
