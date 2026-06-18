"use client";

import Link from "next/link";
import type { Deck } from "@/lib/data";
import { formatEstimatedMinutes, getSituationByDeckId } from "@/lib/data";
import { PremiumBadge } from "@/components/deck/premium-badge";
import { DeckFavoriteButton } from "@/components/deck/deck-favorite-button";
import { getSituationGradient } from "@/lib/ui-theme";
import { cn } from "@/lib/utils";

type PopularDeckCardProps = {
  deck: Deck;
};

export function PopularDeckCard({ deck }: PopularDeckCardProps) {
  const situation = getSituationByDeckId(deck.id);
  const emoji = situation?.emoji ?? "✨";

  return (
    <div className="relative shrink-0 snap-start">
      <Link
        href={`/decks/${deck.id}`}
        className={cn(
          "flex h-[196px] w-[168px] flex-col rounded-[24px] bg-gradient-to-br p-5 shadow-[0_2px_20px_rgba(45,49,66,0.06)] transition-all duration-200 active:scale-[0.98]",
          getSituationGradient(deck.situationId)
        )}
      >
        <div className="flex w-full items-start justify-between gap-2">
          <span className="text-[28px] leading-none">{emoji}</span>
          {deck.isPremium && <PremiumBadge className="bg-white/70" />}
        </div>

        <div className="mt-auto">
          <span className="sai-chip bg-white/55 text-sai-text-secondary">
            {formatEstimatedMinutes(deck.estimatedMinutes)}
          </span>
          <h3 className="mt-2 line-clamp-2 text-[16px] font-bold leading-snug text-sai-text">
            {deck.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-sai-text-secondary">
            {deck.description}
          </p>
        </div>
      </Link>
      <DeckFavoriteButton deckId={deck.id} className="absolute right-3 top-3" />
    </div>
  );
}
