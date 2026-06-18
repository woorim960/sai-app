import type { Card } from "@/lib/data";
import type { GroupState } from "./types";
import { getCompletedCount } from "./result-helpers";

export type ComparisonStats = {
  completedCount: number;
  totalParticipants: number;
  comparableCards: number;
  matchCount: number;
  mismatchCount: number;
  matchRate: number;
  unanimousCount: number;
  mostSplitCardId: string | null;
};

export type CardSplitStat = {
  card: Card;
  aCount: number;
  bCount: number;
  aPercent: number;
  bPercent: number;
  isUnanimous: boolean;
  isMostSplit: boolean;
  entries: Array<{
    displayName: string;
    option: "A" | "B" | null;
    label: string;
    completed: boolean;
  }>;
};

function getCompletedClientIds(state: GroupState): string[] {
  return state.participants
    .filter((p) => p.status === "completed")
    .map((p) => p.clientId);
}

export function buildComparisonStats(
  cards: Card[],
  state: GroupState,
  clientId?: string
): ComparisonStats {
  const balanceCards = cards.filter((c) => c.type === "balance");
  const completedIds = getCompletedClientIds(state);

  let comparableCards = 0;
  let matchCount = 0;
  let unanimousCount = 0;
  let bestSplitScore = -1;
  let mostSplitCardId: string | null = null;

  for (const card of balanceCards) {
    const answers = state.answers.filter(
      (a) =>
        a.cardId === card.id &&
        completedIds.includes(a.clientId) &&
        a.selectedOption
    );

    if (answers.length < 2) continue;

    const options = answers.map((a) => a.selectedOption as "A" | "B");
    const aCount = options.filter((o) => o === "A").length;
    const bCount = options.length - aCount;

    if (options.every((o) => o === options[0])) {
      unanimousCount += 1;
    }

    const splitScore = Math.min(aCount, bCount);
    if (splitScore > bestSplitScore) {
      bestSplitScore = splitScore;
      mostSplitCardId = card.id;
    }

    if (clientId && completedIds.includes(clientId)) {
      const myAnswer = state.answers.find(
        (a) =>
          a.clientId === clientId &&
          a.cardId === card.id &&
          a.selectedOption
      );
      if (!myAnswer?.selectedOption) continue;

      const others = answers.filter((a) => a.clientId !== clientId);
      if (others.length === 0) continue;

      comparableCards += 1;
      const allMatch = others.every(
        (a) => a.selectedOption === myAnswer.selectedOption
      );
      if (allMatch) matchCount += 1;
    } else if (!clientId) {
      comparableCards += 1;
      if (aCount === 0 || bCount === 0) {
        matchCount += 1;
      }
    }
  }

  const mismatchCount = Math.max(0, comparableCards - matchCount);
  const matchRate =
    comparableCards > 0
      ? Math.round((matchCount / comparableCards) * 100)
      : 0;

  return {
    completedCount: getCompletedCount(state),
    totalParticipants: state.participants.length,
    comparableCards,
    matchCount,
    mismatchCount,
    matchRate,
    unanimousCount,
    mostSplitCardId,
  };
}

export function buildCardSplitStats(
  cards: Card[],
  state: GroupState
): CardSplitStat[] {
  const balanceCards = cards.filter((c) => c.type === "balance");
  const completedIds = new Set(getCompletedClientIds(state));

  let bestSplitScore = -1;
  let mostSplitCardId: string | null = null;

  const raw = balanceCards.map((card) => {
    const completedAnswers = state.answers.filter(
      (a) =>
        a.cardId === card.id &&
        completedIds.has(a.clientId) &&
        a.selectedOption
    );

    const aCount = completedAnswers.filter((a) => a.selectedOption === "A").length;
    const bCount = completedAnswers.length - aCount;
    const total = completedAnswers.length;
    const splitScore = total >= 2 ? Math.min(aCount, bCount) : 0;

    if (splitScore > bestSplitScore) {
      bestSplitScore = splitScore;
      mostSplitCardId = card.id;
    }

    return {
      card,
      aCount,
      bCount,
      aPercent: total > 0 ? Math.round((aCount / total) * 100) : 0,
      bPercent: total > 0 ? Math.round((bCount / total) * 100) : 0,
      isUnanimous: total >= 2 && (aCount === 0 || bCount === 0),
      isMostSplit: false,
      entries: state.participants.map((participant) => {
        const answer = state.answers.find(
          (a) =>
            a.clientId === participant.clientId && a.cardId === card.id
        );
        return {
          displayName: participant.displayName,
          option: (answer?.selectedOption as "A" | "B" | null) ?? null,
          label: answer?.selectedLabel ?? "—",
          completed: participant.status === "completed",
        };
      }),
    };
  });

  return raw.map((stat) => ({
    ...stat,
    isMostSplit: stat.card.id === mostSplitCardId && stat.aCount > 0 && stat.bCount > 0,
  }));
}

export function getMatchRateLabel(rate: number): {
  title: string;
  description: string;
  tone: "high" | "mid" | "low";
} {
  if (rate >= 75) {
    return {
      title: "취향이 잘 맞아요",
      description: "많은 선택에서 비슷한 쪽을 골랐어요. 대화가 자연스럽게 이어질 거예요.",
      tone: "high",
    };
  }
  if (rate <= 35) {
    return {
      title: "서로 다른 매력",
      description: "선택이 다양해요. 다른 점을 나누며 대화거리가 더 많아질 거예요.",
      tone: "low",
    };
  }
  return {
    title: "비슷한데 다른 점",
    description: "공통점과 차이가 함께 있어요. 둘 다 이야기보면 좋아요.",
    tone: "mid",
  };
}
