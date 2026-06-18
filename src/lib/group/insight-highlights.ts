import type { Card } from "@/lib/data";
import type { GroupState } from "./types";
import type { CardSplitStat } from "./comparison-stats";
import { buildCardSplitStats } from "./comparison-stats";

export type InsightHighlightKind =
  | "my-persona"
  | "debate-spark"
  | "unanimous"
  | "perfect-match";

export type PersonaChoice = {
  optionA: string;
  optionB: string;
  myLabel: string;
  myOption: "A" | "B";
};

export type InsightHighlight = {
  id: string;
  kind: InsightHighlightKind;
  emoji: string;
  title: string;
  subtitle: string;
  conversationStarter: string;
  choices?: PersonaChoice[];
  chips?: string[];
  optionA?: string;
  optionB?: string;
  aPercent?: number;
  bPercent?: number;
  aNames?: string[];
  bNames?: string[];
  aCount?: number;
  bCount?: number;
  matchedLabel?: string;
  matchedSide?: "A" | "B";
  allNames?: string[];
};

function getCompletedOthers(state: GroupState, clientId: string) {
  return state.participants.filter(
    (p) => p.status === "completed" && p.clientId !== clientId
  );
}

function buildMyPersonaHighlight(
  cards: Card[],
  state: GroupState,
  clientId: string
): InsightHighlight | null {
  const balanceCards = cards.filter((c) => c.type === "balance");
  const choices: PersonaChoice[] = balanceCards
    .map((card) => {
      const answer = state.answers.find(
        (a) =>
          a.clientId === clientId &&
          a.cardId === card.id &&
          a.selectedOption &&
          a.selectedLabel
      );
      if (!answer?.selectedOption || !answer.selectedLabel) return null;
      return {
        optionA: card.optionA ?? "A",
        optionB: card.optionB ?? "B",
        myLabel: answer.selectedLabel,
        myOption: answer.selectedOption as "A" | "B",
      };
    })
    .filter((entry): entry is PersonaChoice => entry !== null);

  if (choices.length === 0) return null;

  return {
    id: "my-persona",
    kind: "my-persona",
    emoji: "✋",
    title: "내가 고른 것들",
    subtitle: `Balance ${choices.length}개 중 내 선택`,
    conversationStarter: "이 중에 제일 '나다운' 선택은 뭐였을까?",
    choices,
  };
}

function buildDebateSparkHighlight(
  cardSplitStats: CardSplitStat[]
): InsightHighlight | null {
  const split = cardSplitStats.find((s) => s.isMostSplit);
  if (!split || split.aCount === 0 || split.bCount === 0) return null;

  const aNames = split.entries
    .filter((e) => e.completed && e.option === "A")
    .map((e) => e.displayName);
  const bNames = split.entries
    .filter((e) => e.completed && e.option === "B")
    .map((e) => e.displayName);

  return {
    id: "debate-spark",
    kind: "debate-spark",
    emoji: "😂",
    title: "여기서 한참 얘기할 각",
    subtitle: `${split.card.optionA} VS ${split.card.optionB}`,
    conversationStarter: "왜 그쪽을 골랐어? 한번 들어보자!",
    optionA: split.card.optionA,
    optionB: split.card.optionB,
    aPercent: split.aPercent,
    bPercent: split.bPercent,
    aCount: split.aCount,
    bCount: split.bCount,
    aNames,
    bNames,
  };
}

function buildUnanimousHighlight(
  cardSplitStats: CardSplitStat[]
): InsightHighlight | null {
  const unanimous = cardSplitStats.find((s) => s.isUnanimous);
  if (!unanimous) return null;

  const matched = unanimous.entries.find(
    (e) => e.completed && e.option
  );
  const allNames = unanimous.entries
    .filter((e) => e.completed && e.option)
    .map((e) => e.displayName);

  const matchedLabel =
    matched?.label ??
    (unanimous.aCount > 0
      ? unanimous.card.optionA
      : unanimous.card.optionB);
  const matchedSide: "A" | "B" = unanimous.aCount > 0 ? "A" : "B";

  return {
    id: "unanimous",
    kind: "unanimous",
    emoji: "🎉",
    title: "전원 합의! 찐친 각",
    subtitle: `모두 같은 선택 — "${matchedLabel}"`,
    conversationStarter: "이건 말할 것도 없이 찐이지?",
    optionA: unanimous.card.optionA,
    optionB: unanimous.card.optionB,
    aPercent: unanimous.aPercent,
    bPercent: unanimous.bPercent,
    aCount: unanimous.aCount,
    bCount: unanimous.bCount,
    matchedLabel,
    matchedSide,
    allNames,
  };
}

function buildPerfectMatchHighlight(
  cards: Card[],
  state: GroupState,
  clientId: string
): InsightHighlight | null {
  const others = getCompletedOthers(state, clientId);
  if (others.length === 0) return null;

  const balanceCards = cards.filter((c) => c.type === "balance");

  for (const card of balanceCards) {
    const myAnswer = state.answers.find(
      (a) =>
        a.clientId === clientId &&
        a.cardId === card.id &&
        a.selectedOption
    );
    if (!myAnswer?.selectedOption) continue;

    const allOthersMatch = others.every((other) => {
      const their = state.answers.find(
        (a) =>
          a.clientId === other.clientId &&
          a.cardId === card.id &&
          a.selectedOption
      );
      return their?.selectedOption === myAnswer.selectedOption;
    });

    if (!allOthersMatch) continue;

    const matchedLabel =
      myAnswer.selectedLabel ??
      (myAnswer.selectedOption === "A" ? card.optionA : card.optionB);

    const allNames = [
      state.participants.find((p) => p.clientId === clientId)?.displayName,
      ...others.map((o) => o.displayName),
    ].filter((n): n is string => Boolean(n));

    return {
      id: "perfect-match",
      kind: "perfect-match",
      emoji: "🤝",
      title: "찰떡궁합 포착",
      subtitle: `전원 "${matchedLabel}" 선택`,
      conversationStarter: "여기서 딱 통했네! 비슷한 취향 또 뭐가 있을까?",
      optionA: card.optionA,
      optionB: card.optionB,
      matchedLabel,
      matchedSide: myAnswer.selectedOption,
      allNames,
      aPercent: myAnswer.selectedOption === "A" ? 100 : 0,
      bPercent: myAnswer.selectedOption === "B" ? 100 : 0,
      aCount: myAnswer.selectedOption === "A" ? allNames.length : 0,
      bCount: myAnswer.selectedOption === "B" ? allNames.length : 0,
    };
  }

  return null;
}

export function buildInsightHighlights(
  cards: Card[],
  state: GroupState,
  clientId: string
): InsightHighlight[] {
  const cardSplitStats = buildCardSplitStats(cards, state);
  const highlights: InsightHighlight[] = [];

  const persona = buildMyPersonaHighlight(cards, state, clientId);
  if (persona) highlights.push(persona);

  const debate = buildDebateSparkHighlight(cardSplitStats);
  if (debate) highlights.push(debate);

  const unanimous = buildUnanimousHighlight(cardSplitStats);
  const perfectMatch = buildPerfectMatchHighlight(cards, state, clientId);

  if (unanimous) {
    highlights.push(unanimous);
  } else if (perfectMatch) {
    highlights.push(perfectMatch);
  }

  return highlights.slice(0, 3);
}
