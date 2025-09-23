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

  useEffect(() => {
    // Always enforce login first

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
