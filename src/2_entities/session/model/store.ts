import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Session, SessionStore } from "../config";

const useSessionStore = create<SessionStore>()(
  persist<SessionStore>(
    (set, get) => ({
      session: null,
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
    }
  )
);

export const useSession = () => {
  const session = useSessionStore((s) => s.session);
  const setSession = useSessionStore((s) => s.setSession);
  const clearSession = useSessionStore((s) => s.clearSession);
  const clearUserData = useSessionStore((s) => s.clearUserData);
  return { session, setSession, clearSession, clearUserData };
};
