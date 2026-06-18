import type { Card } from "@/lib/data";
import {
  getResultInsights,
  type ResultInsight,
} from "@/lib/result-data";
import type { GroupAnswer, GroupState } from "./types";

function getBalanceAnswersForClient(
  state: GroupState,
  clientId: string
): GroupAnswer[] {
  return state.answers.filter(
    (a) => a.clientId === clientId && a.cardType === "balance" && a.selectedOption
  );
}

function getComparableBalanceCards(
  cards: Card[],
  state: GroupState,
  clientId: string
): Array<{
  card: Card;
  myOption: "A" | "B";
  others: Array<{ clientId: string; option: "A" | "B" }>;
}> {
  const balanceCards = cards.filter((c) => c.type === "balance");
  const completedIds = new Set(
    state.participants
      .filter((p) => p.status === "completed" && p.clientId !== clientId)
      .map((p) => p.clientId)
  );

  if (completedIds.size === 0) return [];

  return balanceCards
    .map((card) => {
      const myAnswer = state.answers.find(
        (a) => a.clientId === clientId && a.cardId === card.id && a.selectedOption
      );
      if (!myAnswer?.selectedOption) return null;

      const others = state.answers
        .filter(
          (a) =>
            a.cardId === card.id &&
            a.clientId !== clientId &&
            completedIds.has(a.clientId) &&
            a.selectedOption
        )
        .map((a) => ({
          clientId: a.clientId,
          option: a.selectedOption as "A" | "B",
        }));

      if (others.length === 0) return null;

      return {
        card,
        myOption: myAnswer.selectedOption,
        others,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function buildMyChoiceInsight(answers: GroupAnswer[]): ResultInsight | null {
  const labels = answers
    .map((a) => a.selectedLabel)
    .filter((label): label is string => Boolean(label));

  if (labels.length === 0) return null;

  const firstChoice = labels[0]!;
  const extraCount = labels.length - 1;
  const choiceSummary =
    extraCount > 0
      ? `"${firstChoice}" 외 ${extraCount}가지 선택`
      : `"${firstChoice}" 선택`;

  return {
    id: "my-choice",
    emoji: "🎯",
    title: "나의 오늘 선택",
    description: `Balance 대화에서 ${choiceSummary}을 했어요.`,
  };
}

function buildMatchRateInsight(
  comparable: ReturnType<typeof getComparableBalanceCards>
): ResultInsight | null {
  if (comparable.length === 0) return null;

  let matchCount = 0;
  for (const entry of comparable) {
    const allMatch = entry.others.every((o) => o.option === entry.myOption);
    if (allMatch) matchCount += 1;
  }

  const rate = Math.round((matchCount / comparable.length) * 100);

  if (rate >= 75) {
    return {
      id: "match-high",
      emoji: "🤝",
      title: "취향이 잘 맞아요",
      description: `${comparable.length}개 Balance 중 ${matchCount}개(${rate}%)에서 같은 선택을 했어요. 공통 취향이 많아 대화가 잘 통할 거예요.`,
    };
  }

  if (rate <= 35) {
    return {
      id: "match-low",
      emoji: "🎭",
      title: "서로 다른 매력",
      description: `${comparable.length}개 Balance 중 ${matchCount}개(${rate}%)만 같았어요. 다른 선택이 오히려 좋은 대화거리가 될 수 있어요.`,
    };
  }

  return {
    id: "match-mid",
    emoji: "⚖️",
    title: "비슷한데 다른 점",
    description: `${comparable.length}개 Balance 중 ${matchCount}개(${rate}%)에서 같은 선택을 했어요. 공통점과 차이를 나눠보세요.`,
  };
}

function buildSplitCardInsight(
  cards: Card[],
  state: GroupState
): ResultInsight | null {
  const balanceCards = cards.filter((c) => c.type === "balance");
  const completedIds = state.participants
    .filter((p) => p.status === "completed")
    .map((p) => p.clientId);

  if (completedIds.length < 2) return null;

  let best: { card: Card; splitScore: number } | null = null;

  for (const card of balanceCards) {
    const options = state.answers
      .filter(
        (a) =>
          a.cardId === card.id &&
          completedIds.includes(a.clientId) &&
          a.selectedOption
      )
      .map((a) => a.selectedOption as "A" | "B");

    if (options.length < 2) continue;

    const aCount = options.filter((o) => o === "A").length;
    const bCount = options.length - aCount;
    const splitScore = Math.min(aCount, bCount);

    if (!best || splitScore > best.splitScore) {
      best = { card, splitScore };
    }
  }

  if (!best || best.splitScore === 0) return null;

  const snippet = best.card.question.slice(0, 28);
  const suffix = best.card.question.length > 28 ? "…" : "";

  return {
    id: "most-split",
    emoji: "💥",
    title: "가장 갈린 순간",
    description: `『${snippet}${suffix}』에서 의견이 가장 갈렸어요. 서로 왜 그렇게 선택했는지 물어보세요.`,
  };
}

function buildUnanimousInsight(
  cards: Card[],
  state: GroupState
): ResultInsight | null {
  const balanceCards = cards.filter((c) => c.type === "balance");
  const completedIds = state.participants
    .filter((p) => p.status === "completed")
    .map((p) => p.clientId);

  if (completedIds.length < 2) return null;

  for (const card of balanceCards) {
    const options = state.answers
      .filter(
        (a) =>
          a.cardId === card.id &&
          completedIds.includes(a.clientId) &&
          a.selectedOption
      )
      .map((a) => a.selectedOption as "A" | "B");

    if (options.length < 2) continue;

    const allSame = options.every((o) => o === options[0]);
    if (allSame) {
      const label =
        options[0] === "A" ? card.optionA : card.optionB ?? "같은 선택";
      return {
        id: "unanimous",
        emoji: "✨",
        title: "완벽한 일치",
        description: `모두 "${label}"을 선택했어요. 이 주제만큼은 취향이 딱 맞네요!`,
      };
    }
  }

  return null;
}

export function getGroupPersonalizedInsights(
  situationId: string,
  cards: Card[],
  state: GroupState,
  clientId: string
): ResultInsight[] {
  const myAnswers = getBalanceAnswersForClient(state, clientId);
  const comparable = getComparableBalanceCards(cards, state, clientId);
  const base = getResultInsights(situationId);

  const insights: ResultInsight[] = [];

  const myChoice = buildMyChoiceInsight(myAnswers);
  if (myChoice) insights.push(myChoice);

  const matchRate = buildMatchRateInsight(comparable);
  if (matchRate) insights.push(matchRate);

  const split = buildSplitCardInsight(cards, state);
  if (split) insights.push(split);

  const unanimous = buildUnanimousInsight(cards, state);
  if (unanimous && insights.length < 4) insights.push(unanimous);

  const usedIds = new Set(insights.map((i) => i.id));
  for (const baseInsight of base) {
    if (insights.length >= 4) break;
    if (!usedIds.has(baseInsight.id)) {
      insights.push(baseInsight);
    }
  }

  return insights.slice(0, 4);
}
