import type { Deck } from "@/lib/data";

export function isPremiumDeckLocked(
  deck: Deck,
  unlockedDeckIds: string[]
): boolean {
  return deck.isPremium && !unlockedDeckIds.includes(deck.id);
}

export type DeckPlayBlockReason = "not_found" | "no_cards" | "premium";
export type DeckResultBlockReason = "not_found" | "premium";

export function getDeckPlayBlockReason(
  deck: Deck | undefined,
  cardCount: number,
  unlockedDeckIds: string[] = []
): DeckPlayBlockReason | null {
  if (!deck) return "not_found";
  if (cardCount === 0) return "no_cards";
  if (isPremiumDeckLocked(deck, unlockedDeckIds)) return "premium";
  return null;
}

export function getDeckResultBlockReason(
  deck: Deck | undefined,
  unlockedDeckIds: string[] = []
): DeckResultBlockReason | null {
  if (!deck) return "not_found";
  if (isPremiumDeckLocked(deck, unlockedDeckIds)) return "premium";
  return null;
}

export type DeckAccessFallback = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function getPlayAccessFallback(
  reason: DeckPlayBlockReason,
  deck?: Deck
): DeckAccessFallback {
  switch (reason) {
    case "not_found":
      return {
        title: "덱을 찾을 수 없어요",
        description: "플레이할 덱을 찾지 못했어요.\n홈에서 다시 시작해보세요.",
      };
    case "no_cards":
      return {
        title: "카드가 준비되지 않았어요",
        description:
          "이 덱의 카드가 아직 준비되지 않았어요.\n다른 덱을 선택해보세요.",
        secondaryHref: deck ? `/situations/${deck.situationId}` : "/home",
        secondaryLabel: "덱 목록으로",
      };
    case "premium":
      return {
        title: "Premium 덱이에요",
        description:
          "이 덱은 Premium 전용이에요.\n덱 상세에서 Premium 체험하기를 눌러주세요.",
        primaryHref: deck ? `/decks/${deck.id}` : "/home",
        primaryLabel: "덱 상세로",
      };
  }
}

export function getResultAccessFallback(
  reason: DeckResultBlockReason,
  deck?: Deck
): DeckAccessFallback {
  switch (reason) {
    case "not_found":
      return {
        title: "결과를 불러올 수 없어요",
        description: "덱 정보를 찾지 못했어요.\n홈에서 다시 시작해보세요.",
      };
    case "premium":
      return {
        title: "Premium 덱이에요",
        description:
          "이 덱은 Premium 전용이에요.\n덱 상세에서 Premium 체험하기를 눌러주세요.",
        primaryHref: deck ? `/decks/${deck.id}` : "/home",
        primaryLabel: "덱 상세로",
      };
  }
}
