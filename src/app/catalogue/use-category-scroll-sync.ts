import { useEffect, useRef, useState } from "react";
import type { ICategory } from "@entities/category/config";

interface UseCategoryScrollSyncOptions {
  offset?: number;
  suppressMs?: number;
  initialSelected?: ICategory | null;
}

export const useCategoryScrollSync = (
  categories: ICategory[],
  options?: UseCategoryScrollSyncOptions
) => {
  const {
    offset = 80,
    suppressMs = 800,
    initialSelected = categories[0],
  } = options || {};

  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    initialSelected
  );

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const headingRefs = useRef(new Map<number, HTMLHeadingElement | null>());
  const suppressObserverRef = useRef(false);
  const rAfScheduledRef = useRef(false);
  const programScrollIdRef = useRef(0);
  const suppressTimeoutRef = useRef<number | null>(null);

  const handleCategoryClick = (category: ICategory) => {
    setSelectedCategory(category);
    const el = headingRefs.current.get(category.id);
    if (el) {
      suppressObserverRef.current = true;
      const myId = ++programScrollIdRef.current;
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      if (suppressTimeoutRef.current) {
        window.clearTimeout(suppressTimeoutRef.current);
      }
      suppressTimeoutRef.current = window.setTimeout(() => {
        if (programScrollIdRef.current === myId) {
          suppressObserverRef.current = false;
        }
      }, suppressMs);
    }
  };

  useEffect(() => {
    const root = scrollContainerRef.current;
    if (!root) return;

    const computeActiveCategory = () => {
      if (suppressObserverRef.current) return;

      const scrollTop = root.scrollTop;
      const nearTop = scrollTop <= 2;
      const nearBottom = scrollTop + root.clientHeight >= root.scrollHeight - 2;

      if (nearTop) {
        const first = categories[0];
        if (first && first.id !== selectedCategory?.id)
          setSelectedCategory(first);
        return;
      }

      const containerTop = root.getBoundingClientRect().top;
      const candidates: { id: number; distance: number }[] = [];
      categories.forEach((c) => {
        const el = headingRefs.current.get(c.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = rect.top - containerTop - offset;
        candidates.push({ id: c.id, distance });
      });
      if (candidates.length === 0) return;

      if (nearBottom) {
        const last = categories[categories.length - 1];
        if (last && last.id !== selectedCategory?.id) setSelectedCategory(last);
        return;
      }

      let chosenId: number | null = null;
      for (let i = 0; i < candidates.length; i++) {
        if (candidates[i].distance >= 0) {
          chosenId = candidates[i].id;
          break;
        }
      }
      if (chosenId === null) {
        const above = candidates.filter((c) => c.distance < 0);
        if (above.length > 0) {
          let best = above[0];
          for (let i = 1; i < above.length; i++) {
            if (above[i].distance > best.distance) best = above[i];
          }
          chosenId = best.id;
        } else {
          chosenId = candidates[0].id;
        }
      }

      if (chosenId != null && chosenId !== selectedCategory?.id) {
        const found = categories.find((c) => c.id === chosenId);
        if (found) setSelectedCategory(found);
      }
    };

    const onScroll = () => {
      if (rAfScheduledRef.current) return;
      rAfScheduledRef.current = true;
      requestAnimationFrame(() => {
        computeActiveCategory();
        rAfScheduledRef.current = false;
      });
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    computeActiveCategory();

    return () => {
      root.removeEventListener("scroll", onScroll);
    };
  }, [categories, offset, selectedCategory?.id]);

  return {
    selectedCategory,
    setSelectedCategory,
    scrollContainerRef,
    headingRefs,
    handleCategoryClick,
  } as const;
};
