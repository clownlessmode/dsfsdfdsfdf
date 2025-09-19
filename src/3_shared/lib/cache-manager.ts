/* eslint-disable @typescript-eslint/no-explicit-any */
// Менеджер кеша для предзагруженных ресурсов

export interface CacheData {
  categories: any[];
  products: any[];
  advertisements: any[];
  timestamp: number;
  version: string;
}

export class CacheManager {
  private static instance: CacheManager;
  private readonly CACHE_KEY = "foodcort_preload_cache";
  private readonly CACHE_VERSION = "1.0.0";
  private readonly DEFAULT_EXPIRY = 30 * 60 * 1000; // 30 минут

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  setCache(data: Omit<CacheData, "timestamp" | "version">): void {
    try {
      const cacheData: CacheData = {
        ...data,
        timestamp: Date.now(),
        version: this.CACHE_VERSION,
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Failed to save cache:", error);
    }
  }

  getCache(): CacheData | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const cacheData: CacheData = JSON.parse(cached);

      // Проверяем версию кеша
      if (cacheData.version !== this.CACHE_VERSION) {
        this.clearCache();
        return null;
      }

      // Проверяем срок действия
      if (Date.now() - cacheData.timestamp > this.DEFAULT_EXPIRY) {
        this.clearCache();
        return null;
      }

      return cacheData;
    } catch (error) {
      console.error("Failed to read cache:", error);
      this.clearCache();
      return null;
    }
  }

  clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  }

  isCacheValid(): boolean {
    const cache = this.getCache();
    return cache !== null;
  }

  getCacheAge(): number {
    const cache = this.getCache();
    if (!cache) return 0;
    return Date.now() - cache.timestamp;
  }

  getCacheInfo(): { size: number; age: number; valid: boolean } {
    const cache = this.getCache();
    const size = cache ? JSON.stringify(cache).length : 0;
    const age = this.getCacheAge();
    const valid = this.isCacheValid();

    return { size, age, valid };
  }

  // Принудительное обновление кеша
  async forceRefresh(): Promise<void> {
    this.clearCache();
    // Здесь можно добавить логику для принудительной перезагрузки данных
  }
}

export const cacheManager = CacheManager.getInstance();
