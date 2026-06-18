"use client";

import Link from "next/link";
import { Clock, CircleDot, Users } from "lucide-react";
import { DeckFavoriteButton } from "@/components/deck/deck-favorite-button";
import type { GamePresentation } from "@/lib/data/games";
import { cn } from "@/lib/utils";

type GameListCardProps = {
  item: GamePresentation;
  className?: string;
};

export function GameListCard({ item, className }: GameListCardProps) {
  return (
    <div className={cn("relative", className)}>
      <Link
        href={`/decks/${item.deckId}`}
        className="flex gap-3 rounded-[16px] border border-[#ECECF0] bg-white p-3 pr-11 shadow-[0_1px_10px_rgba(45,49,66,0.035)] transition-all active:scale-[0.99]"
      >
        <span
          className={cn(
            "flex size-[78px] shrink-0 items-center justify-center rounded-[14px] text-[32px]",
            item.thumbClass
          )}
        >
          {item.illustration}
        </span>

        <div className="min-w-0 flex-1">
          <span className="inline-flex text-[10px] font-semibold tracking-wide text-[#B0B0B8]">
            • • •
          </span>

          <h3
            className={cn(
              "text-[16px] font-bold leading-snug tracking-[-0.01em] text-sai-text",
              "mt-0.5"
            )}
          >
            {item.displayTitle}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-sai-text-secondary">
            {item.displayDescription}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#9F9FA8]">
            <span className="inline-flex items-center gap-1">
              <Users className="size-3" strokeWidth={2} />
              2명 이상
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" strokeWidth={2} />
              {item.durationLabel}
            </span>
            <span className="inline-flex items-center gap-1">
              <CircleDot className="size-3" strokeWidth={2} />
              {item.benefitLabel}
            </span>
          </div>
        </div>
      </Link>

      <DeckFavoriteButton
        deckId={item.deckId}
        variant="ghost"
        className="absolute right-2 top-2.5 size-8 text-[#B2B2BA]"
      />
    </div>
  );
}
