"use client";
import NextImage from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_IMAGE_DURATION_SEC,
  DEFAULT_VIDEO_DURATION_SEC,
  IAdvertisement,
} from "../config";
import { getFileType } from "@shared/lib/get-file-type";

interface AdvertisementFullscreenProps {
  advertisements: IAdvertisement[];
}
export const AdvertisementFullscreen = ({
  advertisements,
}: AdvertisementFullscreenProps) => {
  const ads = useMemo(() => advertisements ?? [], [advertisements]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentAd: IAdvertisement | undefined = useMemo(() => {
    if (!ads.length) return undefined;
    return ads[currentIndex % ads.length];
  }, [ads, currentIndex]);

  // Handle advancing slides with durations
  useEffect(() => {
    if (!currentAd) return;

    const durationSec =
      currentAd.seconds ??
      (getFileType(currentAd.url) === "video"
        ? DEFAULT_VIDEO_DURATION_SEC
        : DEFAULT_IMAGE_DURATION_SEC);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setTimeout(() => {
      if (!ads.length) return;
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, Math.max(0, durationSec * 1000));

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentAd, ads.length]);

  return (
    <div className="overflow-hidden h-full absolute -z-1 inset-0 bg-black">
      <div className="w-full h-full relative">
        <AnimatePresence initial={false}>
          {currentAd && (
            <motion.div
              key={currentAd.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {getFileType(currentAd.url) === "image" ? (
                <NextImage
                  src={currentAd.url}
                  alt="advertisement"
                  width={1080}
                  height={1920}
                  priority
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  key={currentAd.id}
                  src={currentAd.url}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  controls={false}
                  preload="none"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
