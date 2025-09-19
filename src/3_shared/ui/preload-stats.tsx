"use client";

import React from "react";
import { cn } from "@shared/lib/utils";

interface PreloadStatsProps {
  categoriesCount: number;
  productsCount: number;
  advertisementsCount: number;
  imagesPreloaded: number;
  className?: string;
}

export const PreloadStats: React.FC<PreloadStatsProps> = ({
  categoriesCount,
  productsCount,
  advertisementsCount,
  imagesPreloaded,
  className,
}) => {
  return (
    <div
      className={cn("bg-card/60 backdrop-blur-sm rounded-2xl p-4", className)}
    >
      <h3 className="text-xl font-bold mb-3 text-center">Загружено ресурсов</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {categoriesCount}
          </div>
          <div className="text-sm text-muted-foreground">Категории</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{productsCount}</div>
          <div className="text-sm text-muted-foreground">Продукты</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {advertisementsCount}
          </div>
          <div className="text-sm text-muted-foreground">Реклама</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {imagesPreloaded}
          </div>
          <div className="text-sm text-muted-foreground">Изображения</div>
        </div>
      </div>
    </div>
  );
};
