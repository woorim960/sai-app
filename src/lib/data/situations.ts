import type { Situation } from "./types";

export const situations: Situation[] = [
  {
    id: "blind-date",
    emoji: "🌱",
    name: "소개팅",
    subtitle: "처음 만나는 사람과 자연스럽게",
    description: "처음 만난 사람과 부담 없이 대화하고 싶을 때",
    sortOrder: 1,
  },
  {
    id: "some",
    emoji: "💜",
    name: "썸",
    subtitle: "조금 더 가까워지고 싶다면",
    description: "은근한 설렘과 서로의 마음을 알아가고 싶을 때",
    sortOrder: 2,
  },
  {
    id: "early-love",
    emoji: "❤️",
    name: "연애 초기",
    subtitle: "더 알아가고 싶은 우리",
    description: "연인이 되었지만 아직 더 알고 싶은 것이 많을 때",
    sortOrder: 3,
  },
  {
    id: "friend",
    emoji: "💛",
    name: "친구",
    subtitle: "편하게, 하지만 조금 더 깊게",
    description: "친구처럼 편하게 시작하지만 서로를 더 알고 싶을 때",
    sortOrder: 4,
  },
];
