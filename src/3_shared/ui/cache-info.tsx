"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@shared/lib/utils";
import { cacheManager } from "@shared/lib/cache-manager";

interface CacheInfoProps {
  className?: string;
}

export const CacheInfo: React.FC<CacheInfoProps> = ({ className }) => {
  const [cacheInfo, setCacheInfo] = useState({ size: 0, age: 0, valid: false });

  useEffect(() => {
    const updateCacheInfo = () => {
      setCacheInfo(cacheManager.getCacheInfo());
    };

    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatAge = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}ч ${minutes % 60}м`;
    if (minutes > 0) return `${minutes}м ${seconds % 60}с`;
    return `${seconds}с`;
  };

  const handleClearCache = () => {
    cacheManager.clearCache();
    setCacheInfo(cacheManager.getCacheInfo());
  };

  // Показываем только в режиме разработки
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 text-xs border",
        className
      )}
    >
      <div className="font-bold mb-2">Кеш предзагрузки</div>

      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Статус:</span>
          <span
            className={cn(
              "font-mono",
              cacheInfo.valid ? "text-green-500" : "text-red-500"
            )}
          >
            {cacheInfo.valid ? "✓ Активен" : "✗ Неактивен"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Размер:</span>
          <span className="font-mono">{formatBytes(cacheInfo.size)}</span>
        </div>

        <div className="flex justify-between">
          <span>Возраст:</span>
          <span className="font-mono">{formatAge(cacheInfo.age)}</span>
        </div>
      </div>

      <button
        onClick={handleClearCache}
        className="mt-2 w-full bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded px-2 py-1 text-xs transition-colors"
      >
        Очистить кеш
      </button>
    </div>
  );
};
