"use client";

import { useEffect, useMemo, useState } from "react";
import {
  filterGamePresentations,
  filterGamePresentationsByContext,
  getOrderedGamePresentations,
  isGamesContext,
  isGamesFilter,
  searchGamePresentations,
  type GamesFilter,
} from "@/lib/data/games";
import { GameFilterChips } from "@/components/games/game-filter-chips";
import { GameListCard } from "@/components/games/game-list-card";

type GamesDeckListProps = {
  query?: string;
  initialFilter?: string;
  initialContext?: string;
};

export function GamesDeckList({
  query = "",
  initialFilter,
  initialContext,
}: GamesDeckListProps) {
  const [filter, setFilter] = useState<GamesFilter>(() => {
    if (initialFilter && isGamesFilter(initialFilter)) return initialFilter;
    return "all";
  });

  useEffect(() => {
    if (initialFilter && isGamesFilter(initialFilter)) {
      setFilter(initialFilter);
      return;
    }
    setFilter("all");
  }, [initialFilter]);

  const items = useMemo(() => {
    const ordered = getOrderedGamePresentations();
    const byContext =
      initialContext && isGamesContext(initialContext)
        ? filterGamePresentationsByContext(ordered, initialContext)
        : ordered;
    const filtered = filterGamePresentations(byContext, filter);
    return searchGamePresentations(filtered, query);
  }, [filter, query, initialContext]);

  return (
    <>
      <GameFilterChips value={filter} onChange={setFilter} className="mt-3" />

      <div className="mt-3.5 space-y-2.5">
        {items.length === 0 ? (
          <p className="py-12 text-center text-[14px] text-sai-text-secondary">
            {query.trim()
              ? "검색 결과가 없어요."
              : "해당하는 게임이 없어요."}
          </p>
        ) : (
          items.map((item) => <GameListCard key={item.deckId} item={item} />)
        )}
      </div>
    </>
  );
}
