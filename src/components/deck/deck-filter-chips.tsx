"use client";

import type { DeckFilter } from "@/lib/data";
import { cn } from "@/lib/utils";

const FILTERS: { id: DeckFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "popular", label: "인기" },
  { id: "new", label: "신규" },
];

type DeckFilterChipsProps = {
  value: DeckFilter;
  onChange: (value: DeckFilter) => void;
  className?: string;
};

export function DeckFilterChips({
  value,
  onChange,
  className,
}: DeckFilterChipsProps) {
  return (
    <div
      className={cn(
        "hide-scrollbar flex gap-2 overflow-x-auto pb-1",
        className
      )}
      role="tablist"
      aria-label="덱 필터"
    >
      {FILTERS.map((filter) => {
        const active = value === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
              active
                ? "bg-sai-primary text-white shadow-[0_4px_14px_rgba(133,118,255,0.25)]"
                : "bg-sai-surface text-sai-text-secondary shadow-[0_2px_10px_rgba(45,49,66,0.05)]"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
