"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AppTabShell } from "@/components/layout/app-tab-shell";
import { DeckListCard } from "@/components/deck/deck-list-card";
import { getDeckById } from "@/lib/data";
import {
  useFavoriteDeckIds,
  usePlayHistory,
} from "@/lib/hooks/use-user-data";
import type { PlayHistoryEntry } from "@/lib/user-data";

function HistoryItem({ entry }: { entry: PlayHistoryEntry }) {
  const date = new Date(entry.completedAt);
  const label = `${date.getMonth() + 1}/${date.getDate()} · ${
    entry.mode === "async" ? "각자하기" : "함께하기"
  }`;
  const href = entry.resultHref ?? `/decks/${entry.deckId}`;

  return (
    <Link
      href={href}
      className="sai-card-soft block p-4 transition-all active:scale-[0.99]"
    >
      <p className="text-[16px] font-bold text-sai-text">{entry.deckTitle}</p>
      <p className="mt-1 text-[13px] text-sai-text-secondary">{label}</p>
      {entry.resultHref && (
        <p className="mt-1 text-[12px] font-semibold text-sai-primary">
          결과 다시 보기 →
        </p>
      )}
    </Link>
  );
}

export function ArchiveScreen() {
  const favoriteIds = useFavoriteDeckIds();
  const history = usePlayHistory();

  const favoriteDecks = useMemo(
    () =>
      favoriteIds
        .map((id) => getDeckById(id))
        .filter((deck): deck is NonNullable<typeof deck> => Boolean(deck)),
    [favoriteIds]
  );

  return (
    <AppTabShell className="page-enter">
      <header className="app-screen-header px-6">
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-sai-text">
          보관함
        </h1>
        <p className="mt-2 text-[14px] text-sai-text-secondary">
          좋아요한 덱과 플레이 기록을 모아뒀어요.
        </p>
      </header>

      <main className="mt-8 space-y-10 px-6">
        <section aria-label="좋아요한 덱">
          <h2 className="sai-section-title">좋아요한 덱</h2>
          <p className="sai-section-desc">하트를 눌러 저장한 덱이에요.</p>
          <div className="mt-4 space-y-3">
            {favoriteDecks.length === 0 ? (
              <p className="py-8 text-center text-[14px] text-sai-text-secondary">
                아직 좋아요한 덱이 없어요.
              </p>
            ) : (
              favoriteDecks.map((deck) => (
                <DeckListCard key={deck.id} deck={deck} />
              ))
            )}
          </div>
        </section>

        <section aria-label="플레이 기록">
          <h2 className="sai-section-title">플레이 기록</h2>
          <p className="sai-section-desc">최근 완료한 덱이에요.</p>
          <div className="mt-4 space-y-3">
            {history.length === 0 ? (
              <p className="py-8 text-center text-[14px] text-sai-text-secondary">
                아직 플레이 기록이 없어요.
              </p>
            ) : (
              history.map((entry) => (
                <HistoryItem key={entry.id} entry={entry} />
              ))
            )}
          </div>
        </section>
      </main>
    </AppTabShell>
  );
}
