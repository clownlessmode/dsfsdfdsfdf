"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
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
  const [isWalkthroughRunning, setIsWalkthroughRunning] = useState(false);
  const [walkthroughIndex, setWalkthroughIndex] = useState(0);
  const [walkthroughTotal, setWalkthroughTotal] = useState(0);
  const hasRunRef = useRef(false);

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

  // Walkthrough on each page load: visit key routes for 2s each, then go home
  useEffect(() => {
    if (hasRunRef.current) return; // prevent multiple runs within the same load
    hasRunRef.current = true;

    try {
      const run = async () => {
        // Build route list: static pages + product pages
        const staticRoutes: string[] = [
          "/init",
          "/catalogue",
          "/cart",
          "/order",
          "/loyal",
          "/", // splash/ads to refresh banner-main
        ];

        let productRoutes = (products || [])
          .map((p) =>
            p && typeof p.id !== "undefined" ? `/catalogue/${p.id}` : null
          )
          .filter((v): v is string => Boolean(v));

        if (productRoutes.length === 0) {
          try {
            const cachedRaw = localStorage.getItem("foodcort_preload_cache");
            if (cachedRaw) {
              const cached = JSON.parse(cachedRaw);
              if (cached && Array.isArray(cached.products)) {
                productRoutes = cached.products
                  .map((p: { id?: number | string }) =>
                    p && typeof p.id !== "undefined"
                      ? `/catalogue/${p.id}`
                      : null
                  )
                  .filter((v: unknown): v is string => typeof v === "string");
              }
            }
          } catch {
            // ignore cache parse errors
          }
        }

        // As a last resort, try fetching product IDs directly
        if (productRoutes.length === 0) {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/product-main`,
              { credentials: "include", cache: "no-store" }
            );
            if (res.ok) {
              const data = await res.json();
              const list = Array.isArray(data?.data) ? data.data : data;
              productRoutes = (list || [])
                .map((p: { id?: number | string }) =>
                  p && typeof p.id !== "undefined" ? `/catalogue/${p.id}` : null
                )
                .filter((v: unknown): v is string => typeof v === "string");
            }
          } catch {}
        }

        const filtered = staticRoutes.filter((p) => p !== "/login");
        const walkthroughRoutes = [...filtered, ...productRoutes];

        setWalkthroughIndex(0);
        setWalkthroughTotal(walkthroughRoutes.length);
        setIsWalkthroughRunning(true);
        try {
          localStorage.setItem("foodcort_walkthrough_running", "true");
        } catch {}

        // Walk through each route for ~2 seconds
        for (const path of walkthroughRoutes) {
          router.push(path);
          setWalkthroughIndex((prev) =>
            Math.min(prev + 1, walkthroughRoutes.length)
          );
          await new Promise((res) => setTimeout(res, 2000));
        }

        // Finish on home page
        router.push("/");
        setIsWalkthroughRunning(false);
        try {
          localStorage.setItem("foodcort_walkthrough_running", "false");
        } catch {}
      };

      run();
    } catch {
      // ignore errors in walkthrough
    }
  }, [
    authorized,
    isPreloading,
    isPreloadComplete,
    router,
    categories,
    products,
  ]);

  const contextValue: PreloadContextType = {
    isPreloading,
    isPreloadComplete,
    startPreload,
    resetPreload,
  };

  return (
    <PreloadContext.Provider value={contextValue}>
      <>
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
        {isWalkthroughRunning && (
          <div
            className="fixed inset-0 z-[1000] backdrop-blur-md bg-black/20 flex items-center justify-center"
            aria-hidden
          >
            <div className="bg-white/80 rounded-3xl px-10 py-8 shadow-2xl border border-white/60">
              <div className="text-3xl font-bold text-center">
                Идет первичная настройка
              </div>
              <div className="mt-3 text-lg text-center text-muted-foreground">
                Пожалуйста, подождите. Разогреваем страницы…
              </div>
              <div className="mt-6 h-2 w-[420px] bg-black/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black/70 transition-all"
                  style={{
                    width: `${Math.min(
                      walkthroughTotal > 0
                        ? Math.round(
                            (walkthroughIndex / walkthroughTotal) * 100
                          )
                        : 0,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="mt-2 text-sm text-center text-muted-foreground">
                {walkthroughIndex} / {walkthroughTotal}
              </div>
            </div>
          </div>
        )}
      </>
    </PreloadContext.Provider>
  );
};
