"use client";

import React from "react";
import { cn } from "@shared/lib/utils";
import { Logotype } from "./logotype";
import { PreloadStats } from "./preload-stats";

interface PreloadScreenProps {
  stage: string;
  progress: number;
  total: number;
  current: number;
  error?: string | null;
  categoriesCount?: number;
  productsCount?: number;
  advertisementsCount?: number;
}

export const PreloadScreen: React.FC<PreloadScreenProps> = ({
  stage,
  progress,
  total,
  current,
  error,
  categoriesCount = 0,
  productsCount = 0,
  advertisementsCount = 0,
}) => {
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="fixed inset-0 bg-foreground flex flex-col items-center justify-center px-6 z-50">
      <div className="w-full flex flex-col items-center gap-8 mb-12">
        <Logotype className="w-[520px] h-auto drop-shadow" />

        <div className="text-center">
          <h1 className="text-6xl font-extrabold tracking-tight mb-4">
            Подготовка терминала
          </h1>
          <p className="text-2xl text-muted-foreground">
            Загружаем все необходимые ресурсы...
          </p>
        </div>
      </div>

      <div className="w-full max-w-[800px] bg-card/80 backdrop-blur-md rounded-[40px] p-8">
        {error ? (
          <div className="text-center">
            <div className="text-red-500 text-3xl font-bold mb-4">
              Ошибка загрузки
            </div>
            <p className="text-xl text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold mb-2">{stage}</h2>
              <p className="text-2xl text-muted-foreground">
                {current} из {total} элементов
              </p>
            </div>

            {/* Прогресс бар */}
            <div className="relative mb-6">
              <div className="w-full bg-muted rounded-full h-8 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out relative"
                  style={{ width: `${percentage}%` }}
                >
                  {/* Анимированный блеск */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>

              {/* Процент */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Детали прогресса */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted/50 rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary">
                  {Math.round(progress)}
                </div>
                <div className="text-lg text-muted-foreground">Этапы</div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary">{current}</div>
                <div className="text-lg text-muted-foreground">Изображения</div>
              </div>

              <div className="bg-muted/50 rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary">
                  {percentage}%
                </div>
                <div className="text-lg text-muted-foreground">Готово</div>
              </div>
            </div>

            {/* Индикатор этапов */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Данные</span>
                <span>Изображения</span>
                <span>Завершено</span>
              </div>
              <div className="flex space-x-2">
                <div
                  className={`flex-1 h-2 rounded-full ${
                    progress >= 1 ? "bg-primary" : "bg-muted"
                  }`}
                />
                <div
                  className={`flex-1 h-2 rounded-full ${
                    progress >= 2 ? "bg-primary" : "bg-muted"
                  }`}
                />
                <div
                  className={`flex-1 h-2 rounded-full ${
                    progress >= 3 ? "bg-primary" : "bg-muted"
                  }`}
                />
              </div>
            </div>

            {/* Статистика загрузки */}
            {(categoriesCount > 0 ||
              productsCount > 0 ||
              advertisementsCount > 0) && (
              <PreloadStats
                categoriesCount={categoriesCount}
                productsCount={productsCount}
                advertisementsCount={advertisementsCount}
                imagesPreloaded={current}
                className="mt-6"
              />
            )}

            {/* Анимированные точки */}
            <div className="flex justify-center mt-6 space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full bg-primary/60 animate-pulse",
                    i === 0 && "animation-delay-0",
                    i === 1 && "animation-delay-200",
                    i === 2 && "animation-delay-400"
                  )}
                  style={{
                    animationDelay: `${i * 200}ms`,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xl text-muted-foreground">
          Это может занять несколько секунд...
        </p>
      </div>
    </div>
  );
};
