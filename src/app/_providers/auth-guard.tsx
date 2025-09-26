"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTerminalAuth } from "@entities/session/model/terminal-auth";
import { useSession } from "@entities/session";

interface Props {
  children: React.ReactNode;
}

export function TerminalAuthGuard({ children }: Props) {
  const authorized = useTerminalAuth((s) => s.authorized);
  const authHydrated = useTerminalAuth((s) => s.hasHydrated);
  const checkAutoAuth = useTerminalAuth((s) => s.checkAutoAuth);
  const { session, hasHydrated: sessionHydrated } = useSession();
  const idStore = session?.idStore;

  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = React.useState(false);

  // Check for auto-auth when both stores are hydrated
  React.useEffect(() => {
    if (authHydrated && sessionHydrated && !authorized) {
      checkAutoAuth();
    }
  }, [authHydrated, sessionHydrated, authorized, checkAutoAuth]);

  // Add a small delay before checking session to allow for updates
  React.useEffect(() => {
    if (authorized && !idStore && !isCheckingSession) {
      setIsCheckingSession(true);
      const timer = setTimeout(() => {
        setIsCheckingSession(false);
      }, 100); // 100ms delay
      return () => clearTimeout(timer);
    }
  }, [authorized, idStore, isCheckingSession]);

  useEffect(() => {
    // Wait for both stores to hydrate to avoid flicker/false redirects
    if (!authHydrated || !sessionHydrated) return;

    // Only redirect to /init if explicitly not authorized (not just missing idStore)
    // This prevents redirects during temporary network issues or loading states
    if (!authorized && pathname !== "/init") {
      router.replace("/init");
      return;
    }

    // If authorized but missing idStore, try to recover from localStorage
    if (authorized && !idStore && pathname !== "/init" && !isCheckingSession) {
      // Check if we have session data in localStorage that might not have hydrated yet
      if (typeof window !== "undefined" && localStorage) {
        const storedSession = localStorage.getItem("session");
        if (storedSession) {
          try {
            const parsed = JSON.parse(storedSession);
            if (parsed.state?.session?.idStore) {
              // Session exists with idStore, just wait for hydration
              return;
            }
          } catch {
            // Invalid stored session, continue to init
          }
        }
      }
      // No valid session found, redirect to init
      router.replace("/init");
      return;
    }

    // If fully authorized (and store id present) and currently on /init, go to root
    if (authorized && idStore && pathname === "/init") {
      router.replace("/");
    }
  }, [authorized, idStore, pathname, router, authHydrated, sessionHydrated]);

  // Optionally could show nothing until hydration to prevent UI flash
  if (!authHydrated || !sessionHydrated) return null;
  return children;
}
