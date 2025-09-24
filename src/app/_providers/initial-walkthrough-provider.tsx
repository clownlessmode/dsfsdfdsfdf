/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  addCacheBuster,
  clearBrowserCache,
  preloadImages,
} from "@shared/lib/cache-utils";
import { useTerminalAuth } from "@entities/session/model/terminal-auth";
import { useSession } from "@entities/session";
import { useCatalogueCache } from "../catalogue/catalogue-cache";

interface InitialWalkthroughProviderProps {
  children: React.ReactNode;
}

interface CategoryGroup {
  id: number;
  name?: string;
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
  // keep store subscription to ensure auth state is hydrated before warmup
  const authorized = useTerminalAuth((s) => s.authorized);
  const { session } = useSession();
  const idStore = session?.idStore;

  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const hasRunRef = useRef(false);
  const originalPathRef = useRef<string | null>(null);

  // Removed reload detection: walkthrough now runs only after successful login

  useEffect(() => {
    // Do not run on login page
    if (pathname?.startsWith("/init")) return;
    // Run ONLY after login when terminal is authorized and store id is present
    if (!authorized || !idStore) return;
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
        return groups.map((g: any) => ({
          id: g.id,
          name: g.name,
          image: g.image,
        }));
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

    const waitForPath = async (targetPath: string, timeoutMs = 8000) => {
      const start = Date.now();
      // Wait until pathname matches and the document has rendered some content
      while (Date.now() - start < timeoutMs) {
        if (window.location.pathname === targetPath) {
          // Ensure the main root has some content to avoid blank white screens
          const hasContent =
            document.body && document.body.innerText.trim().length > 0;
          if (hasContent) return;
        }
        await delay(100);
      }
    };

    const run = async () => {
      const { setCatalogueData } = useCatalogueCache.getState();
      const isDevLogin = (() => {
        try {
          return localStorage.getItem("foodcort_dev_login") === "1";
        } catch {
          return false;
        }
      })();
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
        await clearBrowserCache({
          // Сохраняем dev-флаг, чтобы ускорять прогрев на dev-входе
          keepLocalStorageKeys: ["foodcort_dev_login"],
        });
        await delay(1000);

        // Шаг 2: Загрузка категорий и продуктов
        setCurrentAction("Загрузка данных...");
        setCurrentIndex(++stepIndex);
        const [categories, products] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        // Seed client catalogue cache for later navigations
        try {
          setCatalogueData({
            categories: categories as any,
            products: products as any,
          });
        } catch {}
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
        // Visit ONLY product pages; categories have a separate route and can collide by id
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
        productPaths.forEach(add);

        // Обновляем общее количество шагов (3 начальных + количество страниц для прогрева + переход на главный экран, если мы не на нём)
        const returnExtra = window.location.pathname === "/" ? 0 : 1;
        setTotalSteps(3 + targets.length + returnExtra);

        // По финалу всегда уходим на главную

        // Prefetch all targets to reduce blank screens on navigation
        try {
          for (const p of targets) {
            router.prefetch(p);
          }
        } catch {}

        // Прогрев каждой страницы как отдельный шаг
        for (let i = 0; i < targets.length; i++) {
          const path = targets[i];
          setCurrentAction(`Прогрев страницы: ${path}`);
          setCurrentIndex(++stepIndex);

          if (window.location.pathname !== path) {
            router.push(path, { scroll: false });
            await waitForPath(path, isDevLogin ? 2500 : 6000);
          }
          // Если это страница продукта, открываем extras только вне dev-входа

          try {
            const isProductPage = /^\/catalogue\/(\d+)/.test(path);
            if (isProductPage) {
              const url = new URL(window.location.href);
              url.searchParams.set("openextras", "1");
              window.history.replaceState({}, "", url.toString());
              // Дать времени интерфейсу применить параметр
              await delay(80);
            }
          } catch {}

          // Стоим на каждой странице меньше в dev входе
          await delay(isDevLogin ? 80 : 1400);
        }

        // Переход на главный экран после завершения прогрева
        if (window.location.pathname !== "/") {
          setCurrentAction("Переход на главный экран...");
          setCurrentIndex(++stepIndex);
          router.push("/", { scroll: false });
          await waitForPath("/", isDevLogin ? 2500 : 6000);
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
  }, [authorized, idStore, pathname, router]);

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
