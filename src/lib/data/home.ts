import type { Deck } from "./types";
import { getDeckById } from "./helpers";

export type HomeContext = {
  id: string;
  label: string;
  icon: string;
  situationIds: string[];
};

export type HomeCategory = {
  id: string;
  label: string;
  emoji: string;
  bgClass: string;
  href: string;
};

export type HomeDeckPresentation = {
  deckId: string;
  displayTitle: string;
  displaySubtitle: string;
  tagLabel: string;
  gradientClass: string;
  illustration: string;
  bubbleText?: string;
};

export const HOME_CONTEXTS: HomeContext[] = [
  {
    id: "couple",
    label: "둘이서",
    icon: "👫",
    situationIds: ["some", "early-love", "blind-date"],
  },
  {
    id: "friends",
    label: "친구들과",
    icon: "👥",
    situationIds: ["friend"],
  },
  {
    id: "crush",
    label: "썸/연인",
    icon: "💕",
    situationIds: ["some", "early-love"],
  },
  {
    id: "drinking",
    label: "술자리",
    icon: "🥂",
    situationIds: ["friend"],
  },
  {
    id: "first-meet",
    label: "처음 만난 사이",
    icon: "😊",
    situationIds: ["blind-date"],
  },
];

export const HOME_CATEGORIES: HomeCategory[] = [
  {
    id: "first-meet",
    label: "처음 만난 사이",
    emoji: "🌱",
    bgClass: "bg-[#E8DEFF]",
    href: "/situations/blind-date",
  },
  {
    id: "crush",
    label: "썸/연인",
    emoji: "💕",
    bgClass: "bg-[#FFE0E8]",
    href: "/games?context=crush",
  },
  {
    id: "friend",
    label: "친구",
    emoji: "💛",
    bgClass: "bg-[#DDF0FF]",
    href: "/situations/friend",
  },
  {
    id: "drinking",
    label: "술자리",
    emoji: "🍷",
    bgClass: "bg-[#FFF0C2]",
    href: "/decks/friend-laugh",
  },
  {
    id: "deep-talk",
    label: "심층 대화",
    emoji: "💬",
    bgClass: "bg-[#EDE8FF]",
    href: "/decks/blind-deep-talk",
  },
];

export const HOME_FEATURED_PRESENTATIONS: HomeDeckPresentation[] = [
  {
    deckId: "blind-ice-breaking",
    displayTitle: "어색함 깨기",
    displaySubtitle: "가볍게 시작하기 좋아요!",
    tagLabel: "5분 추천",
    gradientClass: "from-[#8B7CFF] via-[#9D8FFF] to-[#C4BBFF]",
    illustration: "🌱",
    bubbleText: "?!",
  },
  {
    deckId: "some-flutter",
    displayTitle: "설렘 탐험",
    displaySubtitle: "은근한 마음을 알아가요",
    tagLabel: "7분 추천",
    gradientClass: "from-[#FF9EC0] via-[#FFB8D0] to-[#FFD6E8]",
    illustration: "💜",
    bubbleText: "♥",
  },
  {
    deckId: "friend-laugh",
    displayTitle: "웃음 폭탄",
    displaySubtitle: "분위기를 확 풀어줘요",
    tagLabel: "5분 추천",
    gradientClass: "from-[#FFC96B] via-[#FFD98A] to-[#FFE8B0]",
    illustration: "😆",
    bubbleText: "ㅋ",
  },
  {
    deckId: "early-know-each-other",
    displayTitle: "서로 알아가기",
    displaySubtitle: "아직 모르는 모습을 발견해요",
    tagLabel: "7분 추천",
    gradientClass: "from-[#FF9A9A] via-[#FFB4B4] to-[#FFD6D6]",
    illustration: "❤️",
    bubbleText: "?",
  },
  {
    deckId: "blind-taste",
    displayTitle: "취향 탐험",
    displaySubtitle: "서로의 취향을 가볍게 알아가요",
    tagLabel: "7분 추천",
    gradientClass: "from-[#7EC8FF] via-[#9DD4FF] to-[#C8E8FF]",
    illustration: "🎯",
    bubbleText: "VS",
  },
  {
    deckId: "friend-taste",
    displayTitle: "취향 탐험",
    displaySubtitle: "술자리에도 딱 좋아요",
    tagLabel: "7분 추천",
    gradientClass: "from-[#FFB347] via-[#FFC56E] to-[#FFE0A3]",
    illustration: "🍷",
    bubbleText: "!",
  },
];

export const HOME_POPULAR_PRESENTATIONS: HomeDeckPresentation[] = [
  {
    deckId: "blind-ice-breaking",
    displayTitle: "어색함 깨기",
    displaySubtitle: "처음 만남에 딱 좋아요",
    tagLabel: "5분",
    gradientClass: "from-[#EDE8FF] to-[#F5F3FF]",
    illustration: "🌱",
  },
  {
    deckId: "friend-laugh",
    displayTitle: "웃음 폭탄",
    displaySubtitle: "재미있게 가까워져요",
    tagLabel: "5분",
    gradientClass: "from-[#E0F0FF] to-[#F0F8FF]",
    illustration: "😆",
  },
  {
    deckId: "early-know-each-other",
    displayTitle: "서로 알아가기",
    displaySubtitle: "서로를 더 깊이 알아가요",
    tagLabel: "7분",
    gradientClass: "from-[#FFE4EC] to-[#FFF5FA]",
    illustration: "❤️",
  },
  {
    deckId: "some-flutter",
    displayTitle: "설렘 탐험",
    displaySubtitle: "설렘 가득한 밸런스와 질문",
    tagLabel: "7분",
    gradientClass: "from-[#FFE0F0] to-[#FFF5FA]",
    illustration: "💜",
  },
  {
    deckId: "blind-taste",
    displayTitle: "취향 탐험",
    displaySubtitle: "취향으로 알아가기",
    tagLabel: "7분",
    gradientClass: "from-[#FFF8DC] to-[#FFFBF0]",
    illustration: "🎯",
  },
  {
    deckId: "some-love-values",
    displayTitle: "연애 가치관",
    displaySubtitle: "서로의 스타일을 알아봐요",
    tagLabel: "10분",
    gradientClass: "from-[#F0E8FF] to-[#FAF5FF]",
    illustration: "💕",
  },
  {
    deckId: "friend-closer",
    displayTitle: "진짜 가까워지기",
    displaySubtitle: "친구에서 한 걸음 더",
    tagLabel: "10분",
    gradientClass: "from-[#FFF0D6] to-[#FFFAF0]",
    illustration: "✨",
  },
];

function filterPresentationsByContext(
  items: HomeDeckPresentation[],
  contextId?: string
): HomeDeckPresentation[] {
  const context = HOME_CONTEXTS.find((item) => item.id === contextId);
  const filtered = items.filter((item) => {
    const deck = getDeckById(item.deckId);
    if (!deck) return false;
    if (!context) return true;
    return context.situationIds.includes(deck.situationId);
  });

  return filtered.length > 0 ? filtered : items.slice(0, 4);
}

export function getHomeFeaturedDecks(contextId?: string): HomeDeckPresentation[] {
  return filterPresentationsByContext(HOME_FEATURED_PRESENTATIONS, contextId);
}

export function getHomePopularDecks(contextId?: string): HomeDeckPresentation[] {
  return filterPresentationsByContext(HOME_POPULAR_PRESENTATIONS, contextId);
}

export function getTogetherDeckPresentations(): HomeDeckPresentation[] {
  return HOME_FEATURED_PRESENTATIONS.filter((item) => {
    const deck = getDeckById(item.deckId);
    if (!deck) return false;
    return ["some", "early-love", "blind-date"].includes(deck.situationId);
  });
}

export function resolveHomeDeck(deckId: string): Deck | undefined {
  return getDeckById(deckId);
}

export function filterDecksForContext(
  deckList: Deck[],
  contextId: string
): Deck[] {
  const context = HOME_CONTEXTS.find((item) => item.id === contextId);
  if (!context) return deckList;
  return deckList.filter((deck) =>
    context.situationIds.includes(deck.situationId)
  );
}
