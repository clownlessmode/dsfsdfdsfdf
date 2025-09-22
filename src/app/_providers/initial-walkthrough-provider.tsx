/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  addCacheBuster,
  clearBrowserCache,
  preloadImages,
} from "@shared/lib/cache-utils";

interface InitialWalkthroughProviderProps {
  children: React.ReactNode;
}

interface CategoryGroup {
  id: number;
  image?: string | null;
}

interface Product {
  id: number;
  image?: string | null;
  [key: string]: any;
}

export const InitialWalkthroughProvider: React.FC<
  InitialWalkthroughProviderProps
> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
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
        const response = await fetch(
          addCacheBuster(`${process.env.NEXT_PUBLIC_API_URL}/groups`),
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

    const fetchProducts = async (): Promise<Product[]> => {
      try {
        const response = await fetch(
          addCacheBuster(`${process.env.NEXT_PUBLIC_API_URL}/product-main`),
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
        return Array.isArray(data) ? data : data.data || [];
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
      // Устанавливаем флаг прогрева в localStorage для предотвращения редиректов
      try {
        localStorage.setItem("foodcort_walkthrough_running", "true");
      } catch {}

      // Устанавливаем начальное значение totalSteps для корректного отображения
      setTotalSteps(3); // Минимум 3 начальных шага

      let stepIndex = 0;

      try {
        // Шаг 1: Очистка кеша браузера
        setCurrentAction("Очистка кеша браузера...");
        setCurrentIndex(++stepIndex);
        await clearBrowserCache();
        await delay(1000);

        // Шаг 2: Загрузка категорий и продуктов
        setCurrentAction("Загрузка данных...");
        setCurrentIndex(++stepIndex);
        const [categories, products] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        await delay(1000);

        // Шаг 3: Сбор и предзагрузка изображений
        setCurrentAction("Предзагрузка изображений...");
        setCurrentIndex(++stepIndex);
        const imageUrls: string[] = [];

        // Добавляем изображения категорий
        categories.forEach((cat) => {
          if (cat.image) imageUrls.push(cat.image);
        });

        // Добавляем изображения продуктов
        products.forEach((product) => {
          if (product.image) imageUrls.push(product.image);
        });

        await preloadImages(imageUrls);
        await delay(1000);

        // Подготавливаем список всех страниц для прогрева
        const basePaths: string[] = ["/", "/catalogue", "/cart", "/order"];
        const categoryPaths = categories.map((c) => `/catalogue/${c.id}`);
        const productPaths = products.map((p) => `/catalogue/${p.id}`);

        const seen = new Set<string>();
        const targets: string[] = [];
        const add = (p: string) => {
          if (!p || p.startsWith("/init")) return;
          if (!seen.has(p)) {
            seen.add(p);
            targets.push(p);
          }
        };

        basePaths.forEach(add);
        categoryPaths.forEach(add);
        productPaths.forEach(add);

        // Обновляем общее количество шагов (3 начальных + количество страниц для прогрева + возврат на исходную страницу)
        setTotalSteps(3 + targets.length + 1);

        const originalPath = originalPathRef.current ?? "/";

        // Прогрев каждой страницы как отдельный шаг
        for (let i = 0; i < targets.length; i++) {
          const path = targets[i];
          setCurrentAction(`Прогрев страницы: ${path}`);
          setCurrentIndex(++stepIndex);

          if (window.location.pathname !== path) {
            router.push(path, { scroll: false });
            await waitForPath(path, 6000);
          }
          // Стоим 2 секунды на каждой странице
          await delay(2000);
        }

        // Возврат на исходную страницу
        if (window.location.pathname !== originalPath) {
          setCurrentAction("Возврат на исходную страницу...");
          setCurrentIndex(++stepIndex);
          router.push(originalPath, { scroll: false });
          await waitForPath(originalPath, 6000);
        }
      } finally {
        setIsActive(false);
        // Убираем флаг прогрева из localStorage
        try {
          localStorage.removeItem("foodcort_walkthrough_running");
        } catch {}
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
              Принудительная загрузка данных
            </div>
            <div className="text-xl text-muted-foreground mt-3 mb-4">
              {currentAction}
            </div>
            <div className="text-lg text-muted-foreground mb-8">
              Шаг {currentIndex} из {totalSteps}
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
