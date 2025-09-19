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
  const [isPreloadComplete, setIsPreloadComplete] = useState(false);
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
    startPreloadResources();
  }, [startPreloadResources]);

  useEffect(() => {
    if (isComplete && isPreloading) {
      setIsPreloading(false);
      setIsPreloadComplete(true);
    }
  }, [isComplete, isPreloading]);

  // Автоматически запускаем предзагрузку после авторизации
  useEffect(() => {
    if (authorized && !isPreloadComplete && !isPreloading) {
      startPreload();
    }
  }, [authorized, isPreloadComplete, isPreloading, startPreload]);

  const contextValue: PreloadContextType = {
    isPreloading,
    isPreloadComplete,
    startPreload,
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
