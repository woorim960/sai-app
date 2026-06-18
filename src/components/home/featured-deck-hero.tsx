import Link from "next/link";
import type { Deck } from "@/lib/data";
import {
  formatEstimatedMinutes,
  getSituationByDeckId,
} from "@/lib/data";
import { getSituationHeroGradient } from "@/lib/ui-theme";
import { cn } from "@/lib/utils";

type FeaturedDeckHeroProps = {
  deck: Deck;
};

export function FeaturedDeckHero({ deck }: FeaturedDeckHeroProps) {
  const situation = getSituationByDeckId(deck.id);
  const emoji = situation?.emoji ?? "✨";

  return (
    <section className="mt-10" aria-label="지금 하기 좋은 게임">
      <h2 className="sai-section-title px-6">지금 하기 좋은 게임</h2>
      <p className="sai-section-desc px-6">함께하기 좋은 덱을 골라봤어요</p>

      <Link
        href={`/decks/${deck.id}`}
        className={cn(
          "mx-6 mt-4 block overflow-hidden rounded-[24px] bg-gradient-to-br p-6 shadow-[0_4px_24px_rgba(133,118,255,0.12)] transition-all active:scale-[0.99]",
          getSituationHeroGradient(deck.situationId)
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="sai-chip inline-block bg-white/55 text-sai-text-secondary">
              {formatEstimatedMinutes(deck.estimatedMinutes)} · {deck.cardCount}장
            </span>
            <h3 className="mt-3 text-[22px] font-bold tracking-[-0.02em] text-sai-text">
              {deck.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[14px] leading-relaxed text-sai-text-secondary">
              {deck.description}
            </p>
          </div>
          <span className="shrink-0 text-[52px] leading-none">{emoji}</span>
        </div>

        <span className="sai-btn-dark mt-5 h-12 text-[15px]">시작하기</span>
      </Link>
    </section>
  );
}
