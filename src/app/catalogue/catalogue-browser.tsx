"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CartButton } from "@entities/cart";
import { Category } from "@entities/category";
import type { ICategory } from "@entities/category/config";
import { Product as ProductCard } from "@entities/product/ui/product";
import type { IProduct } from "@entities/product/config";

interface CatalogueBrowserProps {
  categories: ICategory[];
  products: IProduct[];
}

export const CatalogueBrowser = ({
  categories,
  products,
}: CatalogueBrowserProps) => {
  const productsContainerRef = useRef<HTMLDivElement | null>(null);
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);
  const isAutoScrollingRef = useRef<boolean>(false);
  const autoScrollTargetTopRef = useRef<number | null>(null);
  const autoScrollTargetGroupIdRef = useRef<number | null>(null);
  const lastUnlockTsRef = useRef<number>(0);
  const ANCHOR_OFFSET = 8;

  // Only categories that actually have products
  const categoriesWithProducts = useMemo(() => {
    return categories.filter((category) =>
      products.some((product) => product.group?.includes(category.id))
    );
  }, [categories, products]);

  // Active group (auto-updated by scrolling)
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(
    () => {
      return categoriesWithProducts[0]?.id ?? categories[0]?.id;
    }
  );

  // Subgroup selection per group
  const [selectedSubgroupByGroup, setSelectedSubgroupByGroup] = useState<
    Record<number, string | undefined>
  >({});

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedGroupId);
  }, [categories, selectedGroupId]);

  const subgroupListByGroup = useMemo(() => {
    const map: Record<number, string[]> = {};
    for (const category of categoriesWithProducts) {
      const subgroups = products
        .filter((p) => p.group?.includes(category.id))
        .flatMap((p) => (Array.isArray(p.subgroup) ? p.subgroup : []))
        .filter(Boolean) as string[];
      map[category.id] = Array.from(new Set(subgroups));
    }
    return map;
  }, [categoriesWithProducts, products]);

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
    const container = productsContainerRef.current;
    const target = sectionRefs.current[groupId];
    if (container && target) {
      const headerH = stickyHeaderRef.current?.offsetHeight ?? 0;
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const relativeTop = targetTop - containerTop + container.scrollTop;
      const top = Math.max(relativeTop - headerH - ANCHOR_OFFSET, 0);
      isAutoScrollingRef.current = true;
      autoScrollTargetTopRef.current = top;
      autoScrollTargetGroupIdRef.current = groupId;
      container.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleSelectSubgroup = (subgroup?: string) => {
    if (!selectedGroupId) return;
    setSelectedSubgroupByGroup((prev) => ({
      ...prev,
      [selectedGroupId]: subgroup,
    }));
    // After selecting a filter, scroll to the start of the current group
    const container = productsContainerRef.current;
    const target = sectionRefs.current[selectedGroupId];
    if (container && target) {
      const headerH = stickyHeaderRef.current?.offsetHeight ?? 0;
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const relativeTop = targetTop - containerTop + container.scrollTop;
      const top = Math.max(relativeTop - headerH - ANCHOR_OFFSET, 0);
      isAutoScrollingRef.current = true;
      autoScrollTargetTopRef.current = top;
      autoScrollTargetGroupIdRef.current = selectedGroupId;
      container.scrollTo({ top, behavior: "smooth" });
    }
  };

  // Section refs for each category
  const sectionRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const setSectionRef = (groupId: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[groupId] = el;
  };

  // Stable scroll-based active category detection
  useEffect(() => {
    const container = productsContainerRef.current;
    if (!container) return;
    const onScroll = () => {
      if (isAutoScrollingRef.current) {
        const targetTop = autoScrollTargetTopRef.current;
        if (
          targetTop != null &&
          Math.abs(container.scrollTop - targetTop) < 4
        ) {
          isAutoScrollingRef.current = false;
          autoScrollTargetTopRef.current = null;
          if (
            autoScrollTargetGroupIdRef.current != null &&
            autoScrollTargetGroupIdRef.current !== selectedGroupId
          ) {
            setSelectedGroupId(autoScrollTargetGroupIdRef.current);
          }
          // keep the preferred id for a short cooldown
          lastUnlockTsRef.current = Date.now();
        }
        return;
      }

      // During a short cooldown after programmatic scroll, stick to target id
      if (Date.now() - lastUnlockTsRef.current < 250) {
        const preferred = autoScrollTargetGroupIdRef.current;
        if (preferred != null && preferred !== selectedGroupId) {
          setSelectedGroupId(preferred);
        }
        return;
      } else {
        autoScrollTargetGroupIdRef.current = null;
      }
      const headerH = stickyHeaderRef.current?.offsetHeight ?? 0;
      const y = container.scrollTop + headerH + ANCHOR_OFFSET;
      let current: number | undefined = categoriesWithProducts[0]?.id;
      for (const category of categoriesWithProducts) {
        const el = sectionRefs.current[category.id];
        if (!el) continue;
        const containerTop = container.getBoundingClientRect().top;
        const elTop = el.getBoundingClientRect().top;
        const relativeTop = elTop - containerTop + container.scrollTop;
        const relativeBottom = relativeTop + el.offsetHeight;
        // if y is within the section bounds -> choose it
        if (y >= relativeTop && y < relativeBottom) {
          current = category.id;
          break;
        }
        // if y is in the gap just before this section -> choose this section
        if (y < relativeTop) {
          current = category.id;
          break;
        }
        // otherwise, y is below this section; keep iterating, defaulting to the last passed
        current = category.id;
      }
      if (current && current !== selectedGroupId) {
        setSelectedGroupId(current);
      }
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    // Initialize selection on mount
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, [categoriesWithProducts, selectedGroupId]);

  return (
    <main className="flex flex-col h-screen overflow-hidden p-10 gap-10 bg-muted justify-start max-w-[1080px]">
      <footer className="absolute bottom-10 right-10">
        <CartButton />
      </footer>
      <div className="grid grid-cols-5 gap-8 flex-1 min-h-0 ">
        <div className="col-span-1 h-full flex flex-col gap-8 overflow-y-auto px-2 py-4 ">
          {categories?.map((category) => (
            <motion.div
              key={category.id}
              onClick={() => handleSelectGroup(category.id)}
              className="cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                  mass: 0.2,
                }}
                className={
                  "w-full rounded-[40px] pb-5 transition-all duration-300 " +
                  (category.id === selectedGroupId
                    ? "scale-[1.1] bg-background shadow-lg"
                    : "")
                }
              >
                <Category category={category} />
              </motion.div>
            </motion.div>
          ))}
        </div>
        <div className="flex flex-col gap-8 col-span-4 min-h-0 ">
          <div
            ref={productsContainerRef}
            className="col-span-4 flex-1 min-h-0 overflow-y-auto"
          >
            {/* Sticky header for current category */}
            <div
              ref={stickyHeaderRef}
              className="sticky top-0 z-10 bg-muted pt-0 pb-6"
            >
              <motion.h1
                key={selectedCategory?.id ?? "catalogue-title"}
                className="text-7xl font-black"
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {selectedCategory?.name ?? "Категория"}
              </motion.h1>
              <div className="flex flex-row w-full col-span-4 gap-4 mt-4 max-w-[900px] overflow-x-auto">
                <motion.button
                  onClick={() => handleSelectSubgroup(undefined)}
                  className={
                    (selectedGroupId &&
                    selectedSubgroupByGroup[selectedGroupId] == null
                      ? "bg-primary text-white "
                      : "bg-background ") +
                    "shadow-lg px-7 py-3 text-4xl font-black w-full rounded-full inline-flex justify-center items-center gap-2.5"
                  }
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  Все
                </motion.button>
                {(selectedGroupId
                  ? subgroupListByGroup[selectedGroupId] ?? []
                  : []
                ).map((sub) => (
                  <motion.button
                    key={sub}
                    onClick={() => handleSelectSubgroup(sub)}
                    className={
                      (selectedGroupId &&
                      selectedSubgroupByGroup[selectedGroupId] === sub
                        ? "bg-primary text-white "
                        : "bg-background ") +
                      "shadow-lg px-7 py-3 text-4xl font-black w-full rounded-full inline-flex justify-center items-center gap-2.5"
                    }
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    {sub}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* All categories rendered as sections */}
            <div className="flex flex-col gap-12">
              {categoriesWithProducts.map((category) => {
                const groupProducts = products.filter((p) =>
                  p.group?.includes(category.id)
                );
                const activeSub = selectedSubgroupByGroup[category.id];
                const productsToShow = activeSub
                  ? groupProducts.filter((p) => p.subgroup?.includes(activeSub))
                  : groupProducts;
                return (
                  <section
                    key={category.id}
                    data-group-id={category.id}
                    ref={setSectionRef(category.id)}
                  >
                    {/* Sentinel element to observe the section's top */}
                    <div data-group-id={category.id} />
                    <div className="grid grid-cols-2 gap-8">
                      <AnimatePresence initial={false}>
                        {productsToShow.map((product) => (
                          <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="h-fit break-inside-avoid mb-8"
                          >
                            <ProductCard product={product} isLoading={false} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CatalogueBrowser;
