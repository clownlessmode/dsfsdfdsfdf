"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTerminalAuth } from "@entities/session/model/terminal-auth";
import { useSession } from "@entities/session";

interface Props {
  children: React.ReactNode;
}

export function TerminalAuthGuard({ children }: Props) {
  const authorized = useTerminalAuth((s) => s.authorized);
  const authHydrated = useTerminalAuth((s) => s.hasHydrated);
  const { session, hasHydrated: sessionHydrated } = useSession();
  const idStore = session?.idStore;

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Wait for both stores to hydrate to avoid flicker/false redirects
    if (!authHydrated || !sessionHydrated) return;

    // If not authorized OR store id is missing, push to /init
    if ((!authorized || !idStore) && pathname !== "/init") {
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
