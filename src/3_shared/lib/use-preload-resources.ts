import { useState } from "react";
import { ICategory } from "@entities/category/config";
import { IProduct, IProductGroup } from "@entities/product/config";
import { IAdvertisement } from "@entities/advertisement/config";
import { imagePreloader } from "./image-preloader";
import { cacheManager } from "./cache-manager";

interface PreloadProgress {
  stage: string;
  progress: number;
  total: number;
  current: number;
}

interface PreloadResult {
  categories: ICategory[];
  products: IProduct[];
  advertisements: IAdvertisement[];
  isComplete: boolean;
  progress: PreloadProgress;
  error: string | null;
}

export const usePreloadResources = () => {
  const [result, setResult] = useState<PreloadResult>({
    categories: [],
    products: [],
    advertisements: [],
    isComplete: false,
    progress: { stage: "Инициализация", progress: 0, total: 0, current: 0 },
    error: null,
  });

  const getCachedData = () => {
    return cacheManager.getCache();
  };

  const setCachedData = (data: {
    categories: ICategory[];
    products: IProduct[];
    advertisements: IAdvertisement[];
  }) => {
    cacheManager.setCache(data);
  };

  const preloadImages = async (
    urls: string[],
    priority: "high" | "normal" | "low" = "normal"
  ): Promise<void> => {
    await imagePreloader.preloadImagesBatch(urls, { priority });
  };

  const fetchCategories = async (): Promise<ICategory[]> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/groups`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  };

  const fetchProducts = async (): Promise<IProduct[]> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/product-main`,
        {
          credentials: "include",
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  };

  const fetchAdvertisements = async (): Promise<IAdvertisement[]> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/advertisement`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch advertisements:", error);
      return [];
    }
  };

  const startPreload = async () => {
    try {
      setResult((prev) => ({
        ...prev,
        progress: { stage: "Проверка кеша", progress: 0, total: 3, current: 0 },
        error: null,
      }));

      // Проверяем кеш
      const cachedData = getCachedData();
      if (cachedData) {
        setResult((prev) => ({
          ...prev,
          categories: cachedData.categories,
          products: cachedData.products,
          advertisements: cachedData.advertisements,
          progress: {
            stage: "Загрузка изображений из кеша",
            progress: 1,
            total: 3,
            current: 1,
          },
        }));
      } else {
        setResult((prev) => ({
          ...prev,
          progress: {
            stage: "Загрузка данных",
            progress: 0,
            total: 3,
            current: 0,
          },
        }));

        // Загружаем данные
        const [categories, products, advertisements] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchAdvertisements(),
        ]);

        // Сохраняем в кеш
        setCachedData({ categories, products, advertisements });

        setResult((prev) => ({
          ...prev,
          categories,
          products,
          advertisements,
          progress: {
            stage: "Загрузка изображений",
            progress: 1,
            total: 3,
            current: 1,
          },
        }));
      }

      // Получаем актуальные данные для предзагрузки изображений
      const currentData = result.categories.length > 0 ? result : cachedData;
      const categories = currentData?.categories || [];
      const products = currentData?.products || [];
      const advertisements = currentData?.advertisements || [];

      // Собираем изображения по приоритетам
      const highPriorityImages: string[] = [];
      const normalPriorityImages: string[] = [];
      const lowPriorityImages: string[] = [];

      // Критически важные статические изображения (высокий приоритет)
      const criticalImages = [
        "/foodcord-terminal/assets/cta-button.png",
        "/foodcord-terminal/assets/camera.png",
      ];
      highPriorityImages.push(...criticalImages);

      // Изображения категорий (высокий приоритет - видны сразу)
      categories.forEach((category) => {
        if (category.image) {
          highPriorityImages.push(category.image);
        }
      });

      // Первые несколько продуктов каждой категории (нормальный приоритет)
      const categoryProductMap = new Map<number, IProduct[]>();
      products.forEach((product) => {
        product.groups.forEach((group: IProductGroup) => {
          if (!categoryProductMap.has(group.id)) {
            categoryProductMap.set(group.id, []);
          }
          categoryProductMap.get(group.id)!.push(product);
        });
      });

      categoryProductMap.forEach((categoryProducts) => {
        // Первые 6 продуктов каждой категории
        categoryProducts.slice(0, 6).forEach((product) => {
          if (product.image) {
            normalPriorityImages.push(product.image);
          }
        });
      });

      // Остальные продукты (низкий приоритет)
      products.forEach((product) => {
        if (product.image && !normalPriorityImages.includes(product.image)) {
          lowPriorityImages.push(product.image);
        }
      });

      // Изображения рекламы (низкий приоритет)
      advertisements.forEach((ad) => {
        if (ad.url) {
          lowPriorityImages.push(ad.url);
        }
      });

      // Дополнительные статические изображения (низкий приоритет)
      const additionalImages = [
        "/foodcord-terminal/receiving-method/in-a-bag.png",
        "/foodcord-terminal/receiving-method/on-the-plate.png",
      ];
      lowPriorityImages.push(...additionalImages);

      // Предзагружаем изображения по приоритетам
      let totalProcessed = 0;
      const totalImages =
        highPriorityImages.length +
        normalPriorityImages.length +
        lowPriorityImages.length;

      // Высокий приоритет
      if (highPriorityImages.length > 0) {
        setResult((prev) => ({
          ...prev,
          progress: {
            stage: "Загрузка критических изображений",
            progress: 1.2,
            total: 3,
            current: totalProcessed,
          },
        }));
        await preloadImages(highPriorityImages, "high");
        totalProcessed += highPriorityImages.length;
      }

      // Нормальный приоритет
      if (normalPriorityImages.length > 0) {
        setResult((prev) => ({
          ...prev,
          progress: {
            stage: "Загрузка основных изображений",
            progress: 1.6,
            total: 3,
            current: totalProcessed,
          },
        }));
        await preloadImages(normalPriorityImages, "normal");
        totalProcessed += normalPriorityImages.length;
      }

      // Низкий приоритет
      if (lowPriorityImages.length > 0) {
        setResult((prev) => ({
          ...prev,
          progress: {
            stage: "Загрузка дополнительных изображений",
            progress: 2,
            total: 3,
            current: totalProcessed,
          },
        }));
        await preloadImages(lowPriorityImages, "low");
        totalProcessed += lowPriorityImages.length;
      }

      setResult((prev) => ({
        ...prev,
        progress: {
          stage: "Завершено",
          progress: 3,
          total: 3,
          current: totalImages,
        },
        isComplete: true,
      }));
    } catch (error) {
      setResult((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      }));
    }
  };

  return {
    ...result,
    startPreload,
    // background refresh that re-fetches data and preloads images silently
    backgroundRefresh: async () => {
      try {
        const [categories, products, advertisements] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
          fetchAdvertisements(),
        ]);

        // update cache with fresh data
        setCachedData({ categories, products, advertisements });

        // collect images from fresh data and warm image cache
        const images: string[] = [];
        categories.forEach((c) => c.image && images.push(c.image));
        products.forEach((p) => p.image && images.push(p.image));
        advertisements.forEach((ad) => ad.url && images.push(ad.url));
        const uniqueImages = Array.from(new Set(images));
        await preloadImages(uniqueImages, "low");
      } catch {
        // ignore background errors
      }
    },
  };
};
