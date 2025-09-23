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
  const { session } = useSession();
  const idStore = session?.idStore;

  const pathname = usePathname();
  const router = useRouter();
  const isReload = (() => {
    try {
      const entries = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      if (entries && entries.length > 0) {
        return entries[0].type === "reload";
      }
      // legacy fallback

      return performance?.navigation?.type === 1;
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    // Skip redirects while walkthrough is running or page is a reload
    try {
      if (localStorage.getItem("foodcort_walkthrough_running") === "true") {
        return;
      }
    } catch {}
    if (isReload) return;

    // If not authorized OR store id is missing, push to /init
    if ((!authorized || !idStore) && pathname !== "/init") {
      router.replace("/init");
    }
    // If fully authorized (and store id present) and currently on /init, go to root
    if (authorized && idStore && pathname === "/init") {
      router.replace("/");
    }
  }, [authorized, idStore, pathname, router]);

  return children;
}
