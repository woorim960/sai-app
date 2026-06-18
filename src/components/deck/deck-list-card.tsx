"use client";

import Link from "next/link";
import type { Deck } from "@/lib/data";
import {
  formatEstimatedMinutes,
  getSituationByDeckId,
} from "@/lib/data";
import { PremiumBadge } from "@/components/deck/premium-badge";
import { DeckFavoriteButton } from "@/components/deck/deck-favorite-button";
import { getSituationIconBg } from "@/lib/ui-theme";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type DeckListCardProps = {
  deck: Deck;
  className?: string;
};

export function DeckListCard({ deck, className }: DeckListCardProps) {
  const situation = getSituationByDeckId(deck.id);
  const emoji = situation?.emoji ?? "✨";

  return (
    <div className={cn("relative", className)}>
      <Link
        href={`/decks/${deck.id}`}
        className="sai-card-soft group flex h-[112px] items-center gap-4 p-4 pr-16 transition-all duration-200 active:scale-[0.99]"
      >
        <span
          className="flex size-[72px] shrink-0 items-center justify-center rounded-[20px] text-[30px]"
          style={{ backgroundColor: getSituationIconBg(deck.situationId) }}
        >
          {emoji}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[16px] font-bold text-sai-text">
              {deck.title}
            </h3>
            {deck.isPremium && <PremiumBadge />}
            {deck.isNew && (
              <span className="sai-chip bg-sai-primary/10 font-semibold text-sai-primary">
                NEW
              </span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-sai-text-secondary">
            {deck.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="sai-chip bg-sai-bg text-sai-text-secondary">
              {formatEstimatedMinutes(deck.estimatedMinutes)}
            </span>
            <span className="sai-chip bg-accent font-medium text-sai-primary">
              {deck.moodLevel}
            </span>
          </div>
        </div>

        <ChevronRight
          className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-sai-text-secondary/60 transition-transform group-active:translate-x-0.5"
          strokeWidth={1.75}
        />
      </Link>

      <DeckFavoriteButton
        deckId={deck.id}
        className="absolute right-12 top-3"
      />
    </div>
  );
}
