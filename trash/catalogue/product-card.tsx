"use client";
import Image from "next/image";
import React, { FC, useState } from "react";

interface Props {
  image: string;
  title: string;
  price: number;
}

export const ProductCard: FC<Props> = ({ image, title, price }) => {
  const [error, setError] = useState(false);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2.5">
      {error ? (
        // Серый квадратик, если картинка не загрузилась
        <div className="overflow-hidden bg-gray-300 min-h-[239px] w-full rounded-3xl flex items-center justify-center">
          <span className="text-gray-500 text-sm">нет фото</span>
        </div>
      ) : (
        <Image
          alt={title}
          src={image}
          width={1080}
          height={1920}
          className="overflow-hidden object-cover max-h-[239px] w-full rounded-3xl"
          onError={() => setError(true)}
        />
      )}

      <div className="flex flex-col justify-start items-center gap-1 px-5">
        <p className="text-[#444444] text-4xl font-black text-center">
          {title}
        </p>
        <p className="text-[#444444] text-2xl font-semibold text-center">
          от {price} ₽
        </p>
      </div>
    </div>
  );
};
