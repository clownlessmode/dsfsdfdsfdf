// src/imageLoader.ts
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Если путь начинается с /assets — добавляем basePath
  if (src.startsWith("/assets")) {
    const basePath = "/foodcord-terminal"; // можно вынести в env
    return `${basePath}/_next/image?url=${encodeURIComponent(
      src
    )}&w=${width}&q=${quality || 75}`;
  }
  // Для внешних изображений
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${
    quality || 75
  }`;
}
