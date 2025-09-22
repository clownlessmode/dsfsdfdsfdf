/**
 * Утилиты для принудительной очистки кеша и обновления данных
 */

/**
 * Добавляет cache-busting параметры к URL
 */
export const addCacheBuster = (url: string): string => {
  const timestamp = Date.now();
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_cb=${timestamp}&_force_reload=true`;
};

/**
 * Очищает кеш браузера
 */
export const clearBrowserCache = async (): Promise<void> => {
  // Очистка Service Worker кеша
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  // Очистка localStorage и sessionStorage
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    console.warn("Could not clear storage:", e);
  }

  // Очистка IndexedDB (если используется)
  if ("indexedDB" in window) {
    try {
      // Здесь можно добавить очистку IndexedDB если необходимо
      console.log("IndexedDB cleanup would go here");
    } catch (e) {
      console.warn("Could not clear IndexedDB:", e);
    }
  }
};

/**
 * Принудительно предзагружает изображения
 */
export const preloadImages = async (imageUrls: string[]): Promise<void> => {
  const promises = imageUrls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = addCacheBuster(url);
    });
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    console.warn("Some images failed to preload:", error);
  }
};

/**
 * Создает fetch запрос с принудительным обновлением
 */
export const createForceReloadFetch = (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const cacheBustedUrl = addCacheBuster(url);

  return fetch(cacheBustedUrl, {
    ...options,
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...options.headers,
    },
  });
};

/**
 * Проверяет, является ли текущая навигация перезагрузкой страницы
 */
export const isPageReload = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const entries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];

    if (entries && entries.length > 0) {
      return entries[0].type === "reload";
    }

    // Fallback для старых браузеров
    return performance?.navigation?.type === 1;
  } catch {
    return false;
  }
};
