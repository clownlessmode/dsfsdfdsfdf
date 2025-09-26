import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session, SessionStore } from "../config";

type SessionHydration = {
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
};

const useSessionStore = create<SessionStore & SessionHydration>()(
  persist<SessionStore & SessionHydration>(
    (set, get) => ({
      session: null,
      hasHydrated: false,
      setHasHydrated: (v: boolean) => set({ hasHydrated: v }),
      setSession: (session: Partial<Session>) =>
        set((state) => {
          const current = state.session;
          const next: Session = {
            telephone: session.telephone ?? current?.telephone ?? "",
            receivingMethod:
              session.receivingMethod ?? current?.receivingMethod ?? null,
            // Preserve existing idStore unless an explicit new value is provided
            idStore: session.idStore ?? current?.idStore,
          };
          return { session: next };
        }),
      clearSession: () => set({ session: null }),
      clearUserData: () => {
        const currentSession = get().session;
        if (currentSession) {
          const newSession = {
            telephone: "",
            receivingMethod: null,
            idStore: currentSession.idStore, // ВСЕГДА сохраняем idStore - это идентификатор магазина
          };
          set({ session: newSession });
        }
      },
    }),
    {
      name: "session",
      // Store session data more persistently
      storage: {
        getItem: (name) => {
          try {
            if (typeof window === "undefined" || !localStorage) return null;
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            if (typeof window === "undefined" || !localStorage) return;
            localStorage.setItem(name, JSON.stringify(value));
          } catch {
            // If localStorage fails, continue without error
            console.warn("Failed to save session to localStorage");
          }
        },
        removeItem: (name) => {
          try {
            if (typeof window === "undefined" || !localStorage) return;
            localStorage.removeItem(name);
          } catch {
            // If localStorage fails, continue without error
            console.warn("Failed to remove session from localStorage");
          }
        },
      },
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated?.(true);
        };
      },
    }
  )
);

export const useSession = () => {
  const session = useSessionStore((s) => s.session);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const setHasHydrated = useSessionStore((s) => s.setHasHydrated);
  const setSession = useSessionStore((s) => s.setSession);
  const clearSession = useSessionStore((s) => s.clearSession);
  const clearUserData = useSessionStore((s) => s.clearUserData);
  return {
    session,
    hasHydrated,
    setHasHydrated,
    setSession,
    clearSession,
    clearUserData,
  };
};
