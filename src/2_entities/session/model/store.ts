import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session, SessionStore } from "../config";

const useSessionStore = create<SessionStore & { hasHydrated: boolean }>()(
  persist<SessionStore & { hasHydrated: boolean }>(
    (set, get) => ({
      session: null,
      hasHydrated: false,
      setSession: (session: Session) => set({ session }),
      clearSession: () => set({ session: null }),
      clearUserData: () => {
        const currentSession = get().session;
        if (currentSession) {
          set({
            session: {
              telephone: "",
              receivingMethod: null,
              idStore: currentSession.idStore, // Сохраняем idStore
            },
          });
        }
      },
    }),
    {
      name: "session",
      onRehydrateStorage: () => {
        return () => {
          set({ hasHydrated: true });
        };
      },
    }
  )
);

export const useSession = () => {
  const session = useSessionStore((s) => s.session);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const setSession = useSessionStore((s) => s.setSession);
  const clearSession = useSessionStore((s) => s.clearSession);
  const clearUserData = useSessionStore((s) => s.clearUserData);
  return { session, hasHydrated, setSession, clearSession, clearUserData };
};
