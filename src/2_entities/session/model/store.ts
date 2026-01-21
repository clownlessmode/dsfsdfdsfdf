import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session, SessionStore } from "../config";

type SessionHydration = {
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
};

const setCookie = (name: string, value: string, days = 1) => {
  if (typeof document === 'undefined') return;

  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Lax`;
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
            const idStore = value.state?.session?.idStore;
            if (idStore != null) {
              setCookie("foodcort_store_id", String(idStore), 1);
            }
          } catch {
            // If sessionStorage fails, continue without error
            console.warn("Failed to save session to sessionStorage");
          }
        },
        removeItem: (name) => {
          try {
            if (typeof window === "undefined" || !sessionStorage) return;
            sessionStorage.removeItem(name);
            document.cookie = "foodcort_store_id=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
          } catch {
            // If sessionStorage fails, continue without error
            console.warn("Failed to remove session from sessionStorage");
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
