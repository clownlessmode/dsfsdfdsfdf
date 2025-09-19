// Утилиты для предзагрузки изображений с приоритетом

export interface ImagePreloadOptions {
  priority?: "high" | "normal" | "low";
  timeout?: number;
  retries?: number;
}

export class ImagePreloader {
  private static instance: ImagePreloader;
  private preloadedImages = new Set<string>();
  private loadingPromises = new Map<string, Promise<void>>();

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader();
    }
    return ImagePreloader.instance;
  }

  async preloadImage(
    src: string,
    options: ImagePreloadOptions = {}
  ): Promise<void> {
    const { timeout = 10000, retries = 3 } = options;

    // Если уже загружено, возвращаем успех
    if (this.preloadedImages.has(src)) {
      return Promise.resolve();
    }

    // Если уже загружается, возвращаем существующий промис
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    const promise = this.loadImageWithRetry(src, retries, timeout);
    this.loadingPromises.set(src, promise);

    try {
      await promise;
      this.preloadedImages.add(src);
    } catch (error) {
      console.warn(`Failed to preload image: ${src}`, error);
    } finally {
      this.loadingPromises.delete(src);
    }
  }

  private async loadImageWithRetry(
    src: string,
    retries: number,
    timeout: number
  ): Promise<void> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await this.loadImage(src, timeout);
        return;
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        // Экспоненциальная задержка между попытками
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  private loadImage(src: string, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${src}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load image: ${src}`));
      };

      // Устанавливаем приоритет загрузки
      if ("fetchPriority" in img) {
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority =
          "high";
      }

      img.src = src;
    });
  }

  async preloadImagesBatch(
    urls: string[],
    options: ImagePreloadOptions = {}
  ): Promise<void> {
    const { priority = "normal" } = options;

    // Для высокого приоритета загружаем последовательно
    if (priority === "high") {
      for (const url of urls) {
        await this.preloadImage(url, options);
      }
    } else {
      // Для обычного и низкого приоритета загружаем параллельно
      const promises = urls.map((url) => this.preloadImage(url, options));
      await Promise.allSettled(promises);
    }
  }

  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  getPreloadedCount(): number {
    return this.preloadedImages.size;
  }

  clearCache(): void {
    this.preloadedImages.clear();
    this.loadingPromises.clear();
  }
}

// Экспорт синглтона
export const imagePreloader = ImagePreloader.getInstance();
