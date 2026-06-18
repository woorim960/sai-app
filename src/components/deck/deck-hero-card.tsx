import { Clock, Layers, Sparkles, Users, type LucideIcon } from "lucide-react";
import type { Deck } from "@/lib/data";
import {
  formatEstimatedMinutes,
  getSituationByDeckId,
} from "@/lib/data";
import { PremiumBadge } from "@/components/deck/premium-badge";
import { getSituationHeroGradient } from "@/lib/ui-theme";
import { cn } from "@/lib/utils";

type DeckHeroCardProps = {
  deck: Deck;
  premiumTrial?: boolean;
};

export function DeckHeroCard({ deck, premiumTrial }: DeckHeroCardProps) {
  const situation = getSituationByDeckId(deck.id);
  const emoji = situation?.emoji ?? "✨";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] bg-gradient-to-br p-6 shadow-[0_16px_40px_rgba(76,63,120,0.22)]",
        getSituationHeroGradient(deck.situationId)
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-14 size-44 rounded-full bg-white/25"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-8 size-36 rounded-full bg-white/15"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col">
            {deck.isPremium && (
              <PremiumBadge className="mb-3 w-fit bg-white/80" trial={premiumTrial} />
            )}
            <h1 className="text-[25px] font-bold leading-[1.25] tracking-[-0.02em] text-sai-text">
              {deck.title}
            </h1>
            <p className="mt-2 text-[14px] leading-relaxed text-sai-text-secondary">
              {deck.description}
            </p>
          </div>

          <div aria-hidden className="relative w-[62px] shrink-0 self-center">
            <span className="absolute left-0 top-2 h-[92px] w-[56px] -rotate-[14deg] rounded-[14px] bg-white/35" />
            <span className="absolute left-1.5 top-1 h-[96px] w-[58px] rotate-[8deg] rounded-[14px] bg-white/55" />
            <span className="relative flex h-[98px] w-[60px] items-center justify-center rounded-[15px] bg-white/90 text-[30px] shadow-[0_10px_22px_rgba(45,49,66,0.14)]">
              {emoji}
            </span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <MetaTag
            icon={Clock}
            label={formatEstimatedMinutes(deck.estimatedMinutes)}
          />
          <MetaTag icon={Users} label="2명 이상" />
          <MetaTag icon={Sparkles} label={deck.moodLevel} accent />
          <MetaTag icon={Layers} label={`${deck.cardCount}문항`} />
        </div>
      </div>
    </div>
  );
}

function MetaTag({
  icon: Icon,
  label,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  accent?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px]",
        accent
          ? "bg-white/80 font-semibold text-sai-primary"
          : "bg-white/60 font-medium text-sai-text-secondary"
      )}
    >
      <Icon className="size-3.5" strokeWidth={2.2} />
      {label}
    </span>
  );
}
