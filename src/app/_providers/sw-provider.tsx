"use client";

import { FC, PropsWithChildren, useEffect } from "react";
import { usePathname } from "next/navigation";

const BASE_PATH = "/foodcord-terminal";

const routesToWarm = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/init`,
  `${BASE_PATH}/catalogue`,
  `${BASE_PATH}/cart`,
  `${BASE_PATH}/order`,
  `${BASE_PATH}/loyal`,
];

async function warmRoutes() {
  try {
    await Promise.all(
      routesToWarm.map((url) =>
        fetch(url, { cache: "no-store" }).catch(() => null)
      )
    );
  } catch {}
}

export const SwProvider: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          `${BASE_PATH}/sw.js`
        );
        if (registration.active) {
          const apiBase = process.env.NEXT_PUBLIC_API_URL;
          if (apiBase) {
            registration.active.postMessage({ type: "set-config", apiBase });
          }
          registration.active.postMessage("force-refresh");
        }
      } catch (e) {
        // ignore
      }
    };

    register();
    warmRoutes();
  }, []);

  // Warm current route on navigation change
  useEffect(() => {
    if (!pathname) return;
    const url = `${BASE_PATH}${pathname}`;
    fetch(url, { cache: "no-store" }).catch(() => null);
  }, [pathname]);

  return <>{children}</>;
};
