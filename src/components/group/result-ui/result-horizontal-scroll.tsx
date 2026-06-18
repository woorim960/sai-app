"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { RESULT_CARD_WIDTH_CLASS } from "@/components/group/result-ui/constants";

type ResultHorizontalScrollProps = {
  children: ReactNode;
  className?: string;
  showDots?: boolean;
};

export function ResultHorizontalScroll({
  children,
  className,
  showDots = true,
}: ResultHorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-scroll-item]");
    if (items.length === 0) return;
    setItemCount(items.length);

    const scrollLeft = el.scrollLeft;
    let closest = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const distance = Math.abs(item.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateActiveIndex();
    el.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);
    return () => {
      el.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [updateActiveIndex, children]);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollRef}
        className="hide-scrollbar flex items-stretch gap-3 overflow-x-auto pb-1 snap-x snap-proximity"
      >
        {children}
        <div aria-hidden className="w-1 shrink-0" />
      </div>

      {itemCount > 1 && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-sai-bg/90 to-transparent"
        />
      )}

      {showDots && itemCount > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2.5">
          <span className="text-[11px] font-semibold tabular-nums text-sai-text-secondary">
            {activeIndex + 1}
            <span className="mx-0.5 text-sai-text-secondary/50">/</span>
            {itemCount}
          </span>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: itemCount }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "w-5 bg-sai-primary"
                    : "w-1.5 bg-[#D8D2F5]"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ResultScrollItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-scroll-item
      className={cn(RESULT_CARD_WIDTH_CLASS, "snap-start self-stretch", className)}
    >
      {children}
    </div>
  );
}
