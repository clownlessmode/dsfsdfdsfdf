"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTerminalAuth } from "@entities/session/model/terminal-auth";

interface Props {
  children: React.ReactNode;
}

export function TerminalAuthGuard({ children }: Props) {
  const authorized = useTerminalAuth((s) => s.authorized);

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

    // If not authorized, always push to /init
    if (!authorized && pathname !== "/init") {
      router.replace("/init");
    }
    // If authorized and currently on /init, block access and go back or to root
    if (authorized && pathname === "/init") {
      router.replace("/");
    }
  }, [authorized, pathname, router]);

  return children;
}
