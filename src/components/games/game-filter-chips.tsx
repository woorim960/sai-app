"use client";

import type { GamesFilter } from "@/lib/data/games";
import { GAMES_FILTERS } from "@/lib/data/games";
import { cn } from "@/lib/utils";

type GameFilterChipsProps = {
  value: GamesFilter;
  onChange: (value: GamesFilter) => void;
  className?: string;
};

export function GameFilterChips({
  value,
  onChange,
  className,
}: GameFilterChipsProps) {
  return (
    <div
      className={cn(
        "hide-scrollbar flex gap-2 overflow-x-auto pb-0.5",
        className
      )}
      role="tablist"
      aria-label="게임 필터"
    >
      {GAMES_FILTERS.map((filter) => {
        const active = value === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter.id)}
            className={cn(
              "shrink-0 rounded-full border px-[16px] py-1.5 text-[12px] font-semibold transition-all active:scale-[0.97]",
              active
                ? "border-sai-primary bg-sai-primary text-white shadow-[0_4px_14px_rgba(145,129,244,0.3)]"
                : "border-[#E8E8ED] bg-white text-[#555565]"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
