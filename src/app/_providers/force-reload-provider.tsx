"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  addCacheBuster,
  clearBrowserCache,
  preloadImages,
  createForceReloadFetch,
  isPageReload,
} from "@shared/lib/cache-utils";

interface ForceReloadProviderProps {
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

export const ForceReloadProvider: React.FC<ForceReloadProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentAction, setCurrentAction] = useState("");
  const hasRunRef = useRef(false);
  const originalPathRef = useRef<string | null>(null);

  const isReload = useMemo(() => isPageReload(), []);

  // Загрузка категорий с принудительным обновлением
  const fetchCategories = async (): Promise<CategoryGroup[]> => {
    try {
      const response = await createForceReloadFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/groups`,
        { credentials: "include" }
      );
      const data = await response.json();
      const groups = Array.isArray(data?.data) ? data.data : [];
      return groups.map((g: any) => ({ id: g.id, image: g.image }));
    } catch {
      return [];
    }
  };

  // Загрузка продуктов с принудительным обновлением
  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await createForceReloadFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-main`,
        { credentials: "include" }
      );
      const data = await response.json();
      return Array.isArray(data) ? data : data.data || [];
    } catch {
      return [];
    }
  };

  // Загрузка конкретного продукта с принудительным обновлением
  const fetchProduct = async (id: number): Promise<Product | null> => {
    try {
      const response = await createForceReloadFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-main/${id}`,
        { credentials: "include" }
      );
      const data = await response.json();
      return data.data || data;
    } catch {
      return null;
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

  useEffect(() => {
    // Не запускаем на странице логина
    if (pathname?.startsWith("/init")) return;
    if (!isReload) return;
    if (hasRunRef.current) return;

    hasRunRef.current = true;
    originalPathRef.current = pathname ?? "/";

    const run = async () => {
      setIsActive(true);
      let stepIndex = 0;
      const totalStepsCount = 6; // Общее количество шагов
      setTotalSteps(totalStepsCount);

      try {
        // Шаг 1: Очистка кеша браузера
        setCurrentAction("Очистка кеша браузера...");
        setCurrentIndex(++stepIndex);
        await clearBrowserCache();
        await delay(1000);

        // Шаг 2: Загрузка категорий
        setCurrentAction("Загрузка категорий...");
        setCurrentIndex(++stepIndex);
        const categories = await fetchCategories();
        await delay(1000);

        // Шаг 3: Загрузка продуктов
        setCurrentAction("Загрузка продуктов...");
        setCurrentIndex(++stepIndex);
        const products = await fetchProducts();
        await delay(1000);

        // Шаг 4: Сбор всех изображений для предзагрузки
        setCurrentAction("Сбор изображений для предзагрузки...");
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

        // Шаг 5: Предзагрузка изображений
        setCurrentAction("Предзагрузка изображений...");
        setCurrentIndex(++stepIndex);
        await preloadImages(imageUrls);
        await delay(1000);

        // Шаг 6: Прогрев страниц
        setCurrentAction("Прогрев страниц...");
        setCurrentIndex(++stepIndex);

        const basePaths: string[] = ["/", "/catalogue", "/cart", "/order"];
        const categoryPaths = categories.map((c) => `/catalogue/${c.id}`);

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

        const originalPath = originalPathRef.current ?? "/";

        for (let i = 0; i < targets.length; i++) {
          const path = targets[i];
          if (window.location.pathname !== path) {
            router.push(path, { scroll: false });
            await waitForPath(path, 6000);
          }
          // Прогрев каждой страницы
          await delay(2000);
        }

        // Возврат на исходную страницу
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
