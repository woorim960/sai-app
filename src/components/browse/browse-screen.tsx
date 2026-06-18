import Link from "next/link";
import { AppTabShell } from "@/components/layout/app-tab-shell";
import { SituationCard } from "@/components/home/situation-card";
import type { Deck, Situation } from "@/lib/data";

type BrowseScreenProps = {
  situations: Situation[];
  popularDecks: Deck[];
};

export function BrowseScreen({ situations, popularDecks }: BrowseScreenProps) {
  return (
    <AppTabShell className="page-enter">
      <header className="app-screen-header px-6">
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-sai-text">
          둘러보기
        </h1>
        <p className="mt-2 text-[14px] text-sai-text-secondary">
          상황별로 덱을 탐색하거나 인기 덱을 만나보세요.
        </p>
      </header>

      <main className="mt-8 space-y-10 px-6">
        <section aria-label="상황별 탐색">
          <h2 className="sai-section-title">상황별 탐색</h2>
          <p className="sai-section-desc">지금 우리에게 맞는 상황을 골라보세요.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {situations.map((situation) => (
              <SituationCard key={situation.id} situation={situation} />
            ))}
          </div>
        </section>

        <section aria-label="인기 덱">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="sai-section-title">인기 덱</h2>
              <p className="sai-section-desc">많이 플레이한 덱이에요.</p>
            </div>
            <Link
              href="/games"
              className="text-[13px] font-semibold text-sai-primary"
            >
              전체 보기
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {popularDecks.map((deck) => (
              <Link
                key={deck.id}
                href={`/decks/${deck.id}`}
                className="sai-card-soft block p-4 transition-all active:scale-[0.99]"
              >
                <p className="text-[16px] font-bold text-sai-text">{deck.title}</p>
                <p className="mt-1 text-[13px] text-sai-text-secondary">
                  {deck.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </AppTabShell>
  );
}
