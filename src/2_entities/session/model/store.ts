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
