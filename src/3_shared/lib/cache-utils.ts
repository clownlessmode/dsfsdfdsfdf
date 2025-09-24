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
export const clearBrowserCache = async (options?: {
  keepLocalStorageKeys?: string[];
}): Promise<void> => {
  // Очистка Service Worker кеша
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  // Очистка localStorage и sessionStorage, с возможностью сохранить некоторые ключи
  try {
    const keep = new Set(options?.keepLocalStorageKeys ?? []);
    const preserved: Record<string, string> = {};
    // Сохраняем нужные ключи
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (keep.has(key)) {
        const value = localStorage.getItem(key);
        if (value !== null) preserved[key] = value;
      }
    }

    localStorage.clear();
    sessionStorage.clear();

    // Восстанавливаем сохранённые ключи
    Object.entries(preserved).forEach(([k, v]) => localStorage.setItem(k, v));
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
  const unique = Array.from(new Set(imageUrls.filter(Boolean)));
  const promises = unique.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      // Preload WITHOUT cache buster so the same URL is reused later
      img.src = url;
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
