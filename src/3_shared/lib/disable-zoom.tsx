"use client";
import { useEffect } from "react";

export default function DisableZoom() {
  useEffect(() => {
    // Запрет Pinch Zoom
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Запрет жестов Safari (gesture* триггеры)
    const onGesture = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("gesturestart", onGesture);
    document.addEventListener("gesturechange", onGesture);
    document.addEventListener("gestureend", onGesture);

    return () => {
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("gesturestart", onGesture);
      document.removeEventListener("gesturechange", onGesture);
      document.removeEventListener("gestureend", onGesture);
    };
  }, []);

  return null;
}
