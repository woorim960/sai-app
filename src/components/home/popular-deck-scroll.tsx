import type { Deck } from "@/lib/data";
import { PopularDeckCard } from "./popular-deck-card";

type PopularDeckScrollProps = {
  popularDecks: Deck[];
};

export function PopularDeckScroll({ popularDecks }: PopularDeckScrollProps) {
  return (
    <section className="mt-10" aria-label="최근 인기 덱">
      <h2 className="sai-section-title px-6">최근 인기 덱</h2>
      <p className="sai-section-desc px-6">많이 플레이한 덱이에요</p>
      <div className="hide-scrollbar mt-4 flex gap-3 overflow-x-auto px-6 pb-2 snap-x snap-mandatory">
        {popularDecks.map((deck) => (
          <PopularDeckCard key={deck.id} deck={deck} />
        ))}
      </div>
    </section>
  );
}
