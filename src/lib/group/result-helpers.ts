import type { Card } from "@/lib/data";
import type { GroupAnswer, GroupParticipant, GroupState } from "./types";

export type CardComparison = {
  card: Card;
  entries: Array<{
    participant: GroupParticipant;
    answer?: GroupAnswer;
  }>;
};

export function buildCardComparisons(
  cards: Card[],
  state: GroupState
): CardComparison[] {
  return cards
    .filter((card) => card.type === "balance")
    .map((card) => ({
      card,
      entries: state.participants.map((participant) => ({
        participant,
        answer: state.answers.find(
          (a) => a.clientId === participant.clientId && a.cardId === card.id
        ),
      })),
    }));
}

export function getCompletedCount(state: GroupState): number {
  return state.participants.filter((p) => p.status === "completed").length;
}

export function getParticipant(
  state: GroupState,
  clientId: string
): GroupParticipant | undefined {
  return state.participants.find((p) => p.clientId === clientId);
}

export function isComparisonAvailable(state: GroupState): boolean {
  return getCompletedCount(state) >= 2;
}

export type MyBalanceResult = {
  card: Card;
  label: string;
};

export function buildMyBalanceResults(
  cards: Card[],
  state: GroupState,
  clientId: string
): MyBalanceResult[] {
  return cards
    .filter((card) => card.type === "balance")
    .map((card) => {
      const answer = state.answers.find(
        (a) => a.clientId === clientId && a.cardId === card.id
      );
      return {
        card,
        label: answer?.selectedLabel ?? "",
      };
    })
    .filter((entry) => entry.label.length > 0);
}

export function getInProgressParticipants(
  state: GroupState
): GroupParticipant[] {
  return state.participants.filter((p) => p.status !== "completed");
}

export type QuestionAnswerBoard = {
  card: Card;
  entries: Array<{
    participant: GroupParticipant;
    answer?: GroupAnswer;
    text: string | null;
    isComplete: boolean;
  }>;
};

export function buildQuestionAnswerBoards(
  cards: Card[],
  state: GroupState
): QuestionAnswerBoard[] {
  return cards
    .filter((card) => card.type === "question")
    .map((card) => ({
      card,
      entries: state.participants.map((participant) => {
        const answer = state.answers.find(
          (item) =>
            item.clientId === participant.clientId && item.cardId === card.id
        );
        const text = answer?.answerText?.trim() || null;
        return {
          participant,
          answer,
          text,
          isComplete: Boolean(answer),
        };
      }),
    }))
    .filter((board) => board.entries.some((entry) => entry.isComplete));
}

export function getAsyncResultStatusLabel(
  state: GroupState,
  comparisonReady: boolean
): string {
  const completedCount = getCompletedCount(state);
  const total = state.participants.length;
  const inProgress = total - completedCount;

  if (comparisonReady) {
    return `${completedCount}명 완료 · 비교 가능`;
  }

  if (inProgress > 0) {
    return `${completedCount}명 완료 · ${inProgress}명 진행 중`;
  }

  return `${completedCount}명 완료 · 친구를 초대하면 비교할 수 있어요`;
}
