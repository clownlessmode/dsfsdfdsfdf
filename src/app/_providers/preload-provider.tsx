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

  const {
    startPreload: startPreloadResources,
    isComplete,
    progress,
    error,
    categories,
    products,
    advertisements,
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
