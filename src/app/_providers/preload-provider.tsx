"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { usePreloadResources } from "@shared/lib/use-preload-resources";
import { PreloadScreen } from "@shared/ui/preload-screen";
import { useTerminalAuth } from "@entities/session/model/terminal-auth";
import { useRouter } from "next/navigation";

interface PreloadContextType {
  isPreloading: boolean;
  isPreloadComplete: boolean;
  startPreload: () => void;
  resetPreload: () => void;
}

const PreloadContext = createContext<PreloadContextType | undefined>(undefined);

export const usePreload = () => {
  const context = useContext(PreloadContext);
  if (!context) {
    throw new Error("usePreload must be used within a PreloadProvider");
  }
  return context;
};

interface PreloadProviderProps {
  children: React.ReactNode;
}

export const PreloadProvider: React.FC<PreloadProviderProps> = ({
  children,
}) => {
  const [isPreloading, setIsPreloading] = useState(false);
  const [isPreloadComplete, setIsPreloadComplete] = useState(() => {
    // Проверяем localStorage при инициализации
    if (typeof window !== "undefined") {
      return localStorage.getItem("foodcort_preload_complete") === "true";
    }
    return false;
  });
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const { authorized } = useTerminalAuth();
  const router = useRouter();

  const {
    startPreload: startPreloadResources,
    isComplete,
    progress,
    error,
    categories,
    products,
    advertisements,
    backgroundRefresh,
  } = usePreloadResources();

  const startPreload = useCallback(() => {
    setIsPreloading(true);
    setIsPreloadComplete(false);
    setMinTimeElapsed(false);

    // Минимальное время отображения экрана предзагрузки (2 секунды)
    setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000);

    startPreloadResources();
  }, [startPreloadResources]);

  const resetPreload = useCallback(() => {
    setIsPreloading(false);
    setIsPreloadComplete(false);
    setMinTimeElapsed(false);
    localStorage.removeItem("foodcort_preload_complete");
    localStorage.removeItem("foodcort_preload_cache");
  }, []);

  useEffect(() => {
    if (isComplete && isPreloading && minTimeElapsed) {
      setIsPreloading(false);
      setIsPreloadComplete(true);
      // Сохраняем в localStorage, что предзагрузка завершена
      localStorage.setItem("foodcort_preload_complete", "true");
    }
  }, [isComplete, isPreloading, minTimeElapsed]);

  // Периодическое обновление каждые 30 минут в фоне
  useEffect(() => {
    const REFRESH_MS = 30 * 60 * 1000;
    const id = setInterval(() => {
      backgroundRefresh();
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage("force-refresh");
      }
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [backgroundRefresh]);

  // Автоматически запускаем предзагрузку после авторизации (только один раз)
  useEffect(() => {
    if (authorized && !isPreloadComplete && !isPreloading) {
      // Проверяем, есть ли уже данные в кеше
      const hasCachedData = localStorage.getItem("foodcort_preload_cache");

      if (hasCachedData) {
        // Если есть кеш, помечаем как завершенное без показа экрана
        setIsPreloadComplete(true);
      } else {
        // Если нет кеша, запускаем предзагрузку
        startPreload();
      }
    }
  }, [authorized, isPreloadComplete, isPreloading, startPreload]);

  // One-time first-run walkthrough: visit key routes for 2s each, then go home
  useEffect(() => {
    if (!authorized) return;
    if (!isPreloadComplete || isPreloading) return;

    try {
      const flagKey = "foodcort_first_walkthrough_done";
      const alreadyDone = localStorage.getItem(flagKey) === "true";
      if (alreadyDone) return;

      const run = async () => {
        // Build route list: static pages + dynamic catalogue categories
        const staticRoutes: string[] = [
          "/init",
          "/catalogue",
          "/cart",
          "/order",
          "/loyal",
        ];

        let categoryRoutes = (categories || [])
          .map((c) =>
            c && typeof c.id !== "undefined" ? `/catalogue/${c.id}` : null
          )
          .filter((v): v is string => Boolean(v));

        if (categoryRoutes.length === 0) {
          try {
            const cachedRaw = localStorage.getItem("foodcort_preload_cache");
            if (cachedRaw) {
              const cached = JSON.parse(cachedRaw);
              if (cached && Array.isArray(cached.categories)) {
                categoryRoutes = cached.categories
                  .map((c: { id?: number | string }) =>
                    c && typeof c.id !== "undefined"
                      ? `/catalogue/${c.id}`
                      : null
                  )
                  .filter((v: unknown): v is string => typeof v === "string");
              }
            }
          } catch {
            // ignore cache parse errors
          }
        }

        const walkthroughRoutes = [...staticRoutes, ...categoryRoutes];

        // Walk through each route for ~2 seconds
        for (const path of walkthroughRoutes) {
          router.push(path);
          await new Promise((res) => setTimeout(res, 2000));
        }

        // Finish on home page
        router.push("/");
        localStorage.setItem(flagKey, "true");
      };

      run();
    } catch {
      // ignore errors in walkthrough
    }
  }, [authorized, isPreloading, isPreloadComplete, router, categories]);

  const contextValue: PreloadContextType = {
    isPreloading,
    isPreloadComplete,
    startPreload,
    resetPreload,
  };

  return (
    <PreloadContext.Provider value={contextValue}>
      {isPreloading ? (
        <PreloadScreen
          stage={progress.stage}
          progress={progress.progress}
          total={progress.total}
          current={progress.current}
          error={error}
          categoriesCount={categories.length}
          productsCount={products.length}
          advertisementsCount={advertisements.length}
        />
      ) : (
        children
      )}
    </PreloadContext.Provider>
  );
};
