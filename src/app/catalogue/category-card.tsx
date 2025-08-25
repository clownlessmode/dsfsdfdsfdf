"use client";
import Image from "next/image";
import React, { FC, useState } from "react";

interface Props {
  image: string;
  title: string;
}

export const CategoryCard: FC<Props> = ({ image, title }) => {
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="overflow-hidden rounded-3xl size-20 bg-gray-300 flex items-center justify-center">
        <Image
          alt={title}
          src={imgSrc}
          width={1080}
          height={1920}
          className="object-cover size-20 rounded-3xl"
          onError={() => setImgSrc("/fallback.png")} // <-- если ошибка, подставляем дефолт
        />
      </div>
      <p className="font-bold tracking-tight">{title}</p>
    </div>
  );
};
