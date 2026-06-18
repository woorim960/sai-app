"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AppTabShell } from "@/components/layout/app-tab-shell";
import { GamesDeckList } from "@/components/games/games-deck-list";
import { GamesCategoryRow } from "@/components/games/games-category-row";
import { cn } from "@/lib/utils";

type GamesScreenProps = {
  initialFilter?: string;
  initialContext?: string;
};

export function GamesScreen({ initialFilter, initialContext }: GamesScreenProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <AppTabShell className="page-enter bg-[#FAFAFC]">
      <header className="app-screen-header flex items-center justify-between px-5">
        <h1 className="text-[29px] font-bold tracking-[-0.03em] text-sai-text">
          게임
        </h1>
        <button
          type="button"
          aria-label="검색"
          aria-pressed={searchOpen}
          onClick={() => {
            setSearchOpen((prev) => {
              if (prev) setQuery("");
              return !prev;
            });
          }}
          className={cn(
            "flex size-9 items-center justify-center rounded-full transition-colors active:scale-95",
            searchOpen
              ? "bg-[#F0EDFF] text-sai-primary"
              : "text-sai-text"
          )}
        >
          <Search className="size-[19px]" strokeWidth={2} />
        </button>
      </header>

      <main className="px-5 pb-2">
        <GamesCategoryRow />

        {searchOpen && (
          <div className="mt-3">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="게임 이름으로 검색"
              autoFocus
              className="h-11 w-full rounded-[14px] border border-[#ECECF0] bg-white px-4 text-[14px] text-sai-text outline-none placeholder:text-sai-text-secondary focus:border-sai-primary"
            />
          </div>
        )}

        <GamesDeckList
          query={query}
          initialFilter={initialFilter}
          initialContext={initialContext}
        />
      </main>
    </AppTabShell>
  );
}
