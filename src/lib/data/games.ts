import type { Deck } from "./types";
import { getDeckById } from "./helpers";
import { HOME_CONTEXTS } from "./home";

export type GamesFilter = "all" | "popular" | "new" | "quick" | "deep";

export type GamePresentation = {
  deckId: string;
  displayTitle: string;
  displayDescription: string;
  thumbClass: string;
  illustration: string;
  durationLabel: string;
  benefitLabel: string;
  isPopular?: boolean;
};

export const GAMES_FILTERS: { id: GamesFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "popular", label: "인기" },
  { id: "new", label: "신규" },
  { id: "quick", label: "5분 게임" },
  { id: "deep", label: "깊은 대화" },
];

export function isGamesFilter(value: string): value is GamesFilter {
  return GAMES_FILTERS.some((item) => item.id === value);
}

const POPULAR_IDS = new Set([
  "blind-ice-breaking",
  "friend-laugh",
  "some-flutter",
  "blind-taste",
  "blind-deep-talk",
  "friend-closer",
]);

/** 상황별 · 쉬운 순 (5분→10분) */
export const GAME_PRESENTATIONS: GamePresentation[] = [
  {
    deckId: "blind-ice-breaking",
    displayTitle: "어색함 깨기",
    displayDescription: "부담 없이 웃으며 가까워져요",
    thumbClass: "bg-[#EDE8FF]",
    illustration: "🌱",
    durationLabel: "5분",
    benefitLabel: "아이스브레이킹",
    isPopular: true,
  },
  {
    deckId: "blind-taste",
    displayTitle: "취향 탐험",
    displayDescription: "밸런스로 서로의 취향을 알아가요",
    thumbClass: "bg-[#E4F0E4]",
    illustration: "🎯",
    durationLabel: "7분",
    benefitLabel: "취향 탐색",
    isPopular: true,
  },
  {
    deckId: "blind-deep-talk",
    displayTitle: "깊어지는 대화",
    displayDescription: "조금 더 진솔한 이야기를 나눠보세요",
    thumbClass: "bg-[#E4EBF0]",
    illustration: "💬",
    durationLabel: "10분",
    benefitLabel: "깊은 대화",
    isPopular: true,
  },
  {
    deckId: "some-flutter",
    displayTitle: "설렘 탐험",
    displayDescription: "은근한 설렘을 발견하는 밸런스와 질문",
    thumbClass: "bg-[#E8DEFF]",
    illustration: "💜",
    durationLabel: "7분",
    benefitLabel: "설렘 UP",
    isPopular: true,
  },
  {
    deckId: "some-love-values",
    displayTitle: "연애 가치관",
    displayDescription: "서로의 연애 스타일을 알아보세요",
    thumbClass: "bg-[#F0E8FF]",
    illustration: "💕",
    durationLabel: "10분",
    benefitLabel: "진솔함",
  },
  {
    deckId: "some-closer",
    displayTitle: "조금 더 가까워지기",
    displayDescription: "한 걸음 더 가까워지는 질문들",
    thumbClass: "bg-[#FFE0F0]",
    illustration: "✨",
    durationLabel: "10분",
    benefitLabel: "친밀도 UP",
  },
  {
    deckId: "early-know-each-other",
    displayTitle: "서로 알아가기",
    displayDescription: "아직 모르는 서로의 모습을 발견해요",
    thumbClass: "bg-[#FFE4EC]",
    illustration: "❤️",
    durationLabel: "7분",
    benefitLabel: "친밀도 UP",
  },
  {
    deckId: "early-love-language",
    displayTitle: "사랑 표현 방식",
    displayDescription: "서로의 애정 표현을 알아보세요",
    thumbClass: "bg-[#FFE8E8]",
    illustration: "💌",
    durationLabel: "10분",
    benefitLabel: "따뜻함",
  },
  {
    deckId: "early-future",
    displayTitle: "미래 이야기",
    displayDescription: "부담 없이 미래를 상상해보세요",
    thumbClass: "bg-[#FFF0E0]",
    illustration: "🌅",
    durationLabel: "10분",
    benefitLabel: "깊은 대화",
  },
  {
    deckId: "friend-laugh",
    displayTitle: "웃음 폭탄",
    displayDescription: "가볍게 웃으며 분위기를 풀어보세요",
    thumbClass: "bg-[#FFF3D6]",
    illustration: "😆",
    durationLabel: "5분",
    benefitLabel: "웃음 UP",
    isPopular: true,
  },
  {
    deckId: "friend-taste",
    displayTitle: "취향 탐험",
    displayDescription: "친구처럼 편하게 서로를 알아가요",
    thumbClass: "bg-[#E0F0FF]",
    illustration: "🍷",
    durationLabel: "7분",
    benefitLabel: "가볍게",
  },
  {
    deckId: "friend-closer",
    displayTitle: "진짜 가까워지기",
    displayDescription: "조금 더 깊고 설레는 이야기",
    thumbClass: "bg-[#FFF8DC]",
    illustration: "🤝",
    durationLabel: "10분",
    benefitLabel: "친밀도 UP",
    isPopular: true,
  },
];

export function getGamePresentation(deckId: string): GamePresentation | undefined {
  return GAME_PRESENTATIONS.find((item) => item.deckId === deckId);
}

export function getOrderedGamePresentations(): GamePresentation[] {
  return GAME_PRESENTATIONS.filter((item) => getDeckById(item.deckId));
}

export function filterGamePresentations(
  items: GamePresentation[],
  filter: GamesFilter
): GamePresentation[] {
  if (filter === "popular") {
    return items.filter(
      (item) => item.isPopular || POPULAR_IDS.has(item.deckId)
    );
  }
  if (filter === "new") {
    return items.filter((item) => getDeckById(item.deckId)?.isNew);
  }
  if (filter === "quick") {
    return items.filter((item) => {
      const deck = getDeckById(item.deckId);
      return deck ? deck.estimatedMinutes <= 7 : false;
    });
  }
  if (filter === "deep") {
    return items.filter((item) => {
      const deck = getDeckById(item.deckId);
      if (!deck) return false;
      return (
        deck.estimatedMinutes >= 10 ||
        deck.moodLevel.includes("깊") ||
        item.benefitLabel.includes("깊") ||
        item.benefitLabel.includes("팀워크")
      );
    });
  }
  return items;
}

export function searchGamePresentations(
  items: GamePresentation[],
  query: string
): GamePresentation[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;

  return items.filter((item) => {
    const deck = getDeckById(item.deckId);
    const haystack = [
      item.displayTitle,
      item.displayDescription,
      item.benefitLabel,
      deck?.title,
      deck?.description,
      deck?.moodLevel,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function filterGamePresentationsByContext(
  items: GamePresentation[],
  contextId: string
): GamePresentation[] {
  const context = HOME_CONTEXTS.find((item) => item.id === contextId);
  if (!context) return items;

  const filtered = items.filter((item) => {
    const deck = getDeckById(item.deckId);
    return deck ? context.situationIds.includes(deck.situationId) : false;
  });

  return filtered.length > 0 ? filtered : items;
}

export function isGamesContext(value: string): boolean {
  return HOME_CONTEXTS.some((item) => item.id === value);
}

export function resolveGameDeck(deckId: string): Deck | undefined {
  return getDeckById(deckId);
}
