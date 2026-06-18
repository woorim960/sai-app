import { MobileShell } from "@/components/layout/mobile-shell";
import { BackButton } from "@/components/ui/back-button";
import { SituationHeader } from "@/components/situation/situation-header";
import { FilteredDeckList } from "@/components/deck/filtered-deck-list";
import type { Situation, Deck } from "@/lib/data";

type DeckListScreenProps = {
  situation: Situation;
  decks: Deck[];
};

export function DeckListScreen({ situation, decks }: DeckListScreenProps) {
  return (
    <MobileShell className="page-enter pb-12">
      <header className="app-screen-header px-6">
        <BackButton href="/home" />
        <SituationHeader situation={situation} />
      </header>

      <main className="mt-8 px-6">
        <FilteredDeckList
          decks={decks}
          emptyMessage="이 상황에 맞는 덱이 없어요."
        />
      </main>
    </MobileShell>
  );
}
