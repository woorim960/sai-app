"use client";

import { Suspense, useEffect, useState } from "react";
import { OnboardingHintBanner } from "@/components/layout/onboarding-hint-banner";
import { MobileShell } from "@/components/layout/mobile-shell";
import { BackButton } from "@/components/ui/back-button";
import { DeckHeroCard } from "@/components/deck/deck-hero-card";
import { DeckFavoriteButton } from "@/components/deck/deck-favorite-button";
import { ConversationFlow } from "@/components/deck/conversation-flow";
import { DeckPlayActions } from "@/components/deck/deck-play-actions";
import type { Deck } from "@/lib/data";
import { getConversationPreview } from "@/lib/data";
import { consumePendingHomeDeckClick } from "@/lib/home-experiment";
import { getSmartBackHref } from "@/lib/navigation/history";
import { isPremiumDeckUnlocked } from "@/lib/storage";

type DeckDetailScreenProps = {
  deck: Deck;
  backHref: string;
};

export function DeckDetailScreen({ deck, backHref }: DeckDetailScreenProps) {
  const conversationItems = getConversationPreview(deck.id);
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const smartBackHref = mounted ? getSmartBackHref(backHref) : backHref;

  useEffect(() => {
    setUnlocked(isPremiumDeckUnlocked(deck.id));
  }, [deck.id]);

  useEffect(() => {
    const syncUnlocked = () => setUnlocked(isPremiumDeckUnlocked(deck.id));
    window.addEventListener("pageshow", syncUnlocked);
    window.addEventListener("focus", syncUnlocked);
    return () => {
      window.removeEventListener("pageshow", syncUnlocked);
      window.removeEventListener("focus", syncUnlocked);
    };
  }, [deck.id]);

  useEffect(() => {
    consumePendingHomeDeckClick(deck.id);
  }, [deck.id]);

  const isLocked = deck.isPremium && !unlocked;

  return (
    <MobileShell className="page-enter">
      <div className="flex h-full min-h-0 flex-col overflow-hidden pb-8 safe-pt">
        <header className="shrink-0 px-5 pb-1">
          <BackButton href={smartBackHref} />
        </header>

        <main className="app-viewport-scroll mt-4 min-h-0 flex-1 px-6">
          <OnboardingHintBanner className="mb-4" />
          <div className="relative">
            <DeckHeroCard deck={deck} premiumTrial={deck.isPremium && unlocked} />
            <DeckFavoriteButton
              deckId={deck.id}
              className="absolute right-4 top-4"
            />
          </div>
          <ConversationFlow items={conversationItems} />
          <Suspense
            fallback={
              <div className="mt-9 pb-4">
                <p className="text-[17px] font-bold text-sai-text">
                  어떻게 플레이할까요?
                </p>
                <div className="mt-4 h-[168px] animate-pulse rounded-[20px] bg-accent/40" />
              </div>
            }
          >
            <DeckPlayActions deck={deck} isLocked={isLocked} />
          </Suspense>
        </main>
      </div>
    </MobileShell>
  );
}
