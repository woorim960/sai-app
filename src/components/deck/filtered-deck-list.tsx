"use client";

import { useMemo, useState } from "react";
import type { Deck, DeckFilter } from "@/lib/data";
import { filterDecks } from "@/lib/data";
import { DeckFilterChips } from "@/components/deck/deck-filter-chips";
import { DeckListCard } from "@/components/deck/deck-list-card";

type FilteredDeckListProps = {
  decks: Deck[];
  emptyMessage?: string;
};

export function FilteredDeckList({
  decks,
  emptyMessage = "해당하는 덱이 없어요.",
}: FilteredDeckListProps) {
  const [filter, setFilter] = useState<DeckFilter>("all");

  const filteredDecks = useMemo(
    () => filterDecks(decks, filter),
    [decks, filter]
  );

  return (
    <>
      <DeckFilterChips value={filter} onChange={setFilter} />
      <div className="mt-4 space-y-3">
        {filteredDecks.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-sai-text-secondary">
            {emptyMessage}
          </p>
        ) : (
          filteredDecks.map((deck) => (
            <DeckListCard key={deck.id} deck={deck} />
          ))
        )}
      </div>
    </>
  );
}
