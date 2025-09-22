/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface InitialWalkthroughProviderProps {
  children: React.ReactNode;
}

interface CategoryGroup {
  id: number;
  image?: string | null;
}

export const InitialWalkthroughProvider: React.FC<
  InitialWalkthroughProviderProps
> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const hasRunRef = useRef(false);
  const originalPathRef = useRef<string | null>(null);

  const isReload = useMemo(() => {
    if (typeof window === "undefined") return false;
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
  }, []);

  useEffect(() => {
    // Do not run on login page
    if (pathname?.startsWith("/init")) return;
    if (!isReload) return;
    if (hasRunRef.current) return;

    hasRunRef.current = true;
    originalPathRef.current = pathname ?? "/";

    const fetchCategories = async (): Promise<CategoryGroup[]> => {
      try {
        const timestamp = Date.now();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/groups?_cb=${timestamp}&_force_reload=true`,
          {
            credentials: "include",
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        const data = await response.json();
        const groups = Array.isArray(data?.data) ? data.data : [];
        return groups.map((g: any) => ({ id: g.id, image: g.image }));
      } catch {
        return [];
      }
    };

    const delay = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const waitForPath = async (targetPath: string, timeoutMs = 5000) => {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        if (window.location.pathname === targetPath) return;
        await delay(50);
      }
    };

    const run = async () => {
      setIsActive(true);
      try {
        const categories = await fetchCategories();

        const basePaths: string[] = ["/", "/catalogue", "/cart", "/order"];

        // Build category pages
        const categoryPaths = categories.map((c) => `/catalogue/${c.id}`);

        // Build full walkthrough list; avoid duplicates and login route
        const seen = new Set<string>();
        const targets: string[] = [];
        const add = (p: string) => {
          if (!p || p.startsWith("/init")) return;
          if (!seen.has(p)) {
            seen.add(p);
            targets.push(p);
          }
        };

        // Prioritize home and catalogue first, then categories, finally cart/order
        basePaths.forEach(add);
        categoryPaths.forEach(add);

        // Keep current page in the list as well (if present), but we'll start from current
        setTotalSteps(targets.length);

        const originalPath = originalPathRef.current ?? "/";

        for (let i = 0; i < targets.length; i++) {
          const path = targets[i];
          // Navigate only if different from current to avoid unnecessary rerenders
          if (window.location.pathname !== path) {
            router.push(path, { scroll: false });
            await waitForPath(path, 6000);
          }
          setCurrentIndex(i + 1);
          // Warm up for 4 seconds on each page
          await delay(4000);
        }

        // Return to original page if it is different
        if (window.location.pathname !== originalPath) {
          router.push(originalPath, { scroll: false });
          await waitForPath(originalPath, 6000);
        }
      } finally {
        setIsActive(false);
      }
    };

    run();
  }, [isReload, pathname, router]);

  const progressPercent = useMemo(() => {
    if (totalSteps <= 0) return 0;
    return Math.min(100, Math.round((currentIndex / totalSteps) * 100));
  }, [currentIndex, totalSteps]);

  return (
    <>
      {children}
      {isActive && (
        <div className="fixed inset-0 z-[1000] bg-background/60 backdrop-blur-md flex items-center justify-center">
          <div className="w-[720px] max-w-[90vw] rounded-[32px] border bg-card shadow-lg p-10 text-center">
            <div className="text-3xl font-extrabold">
              Первоначальная настройка
            </div>
            <div className="text-xl text-muted-foreground mt-3 mb-8">
              Подогрев страниц и загрузка изображений ({currentIndex}/
              {totalSteps})
            </div>
            <div className="w-full h-4 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
