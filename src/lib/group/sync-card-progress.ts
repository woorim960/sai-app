import type { Card } from "@/lib/data";
import type { GroupAnswer, GroupState } from "./types";

export function getAnswersForCard(
  state: GroupState,
  cardId: string
): GroupAnswer[] {
  return state.answers.filter((answer) => answer.cardId === cardId);
}

export function hasParticipantAnswered(
  state: GroupState,
  cardId: string,
  clientId: string
): boolean {
  return state.answers.some(
    (answer) => answer.clientId === clientId && answer.cardId === cardId
  );
}

export function countAnsweredParticipants(
  state: GroupState,
  cardId: string
): number {
  const answeredIds = new Set(
    getAnswersForCard(state, cardId).map((answer) => answer.clientId)
  );
  return state.participants.filter((participant) =>
    answeredIds.has(participant.clientId)
  ).length;
}

export function allParticipantsAnswered(
  state: GroupState,
  cardId: string
): boolean {
  if (state.participants.length === 0) return false;
  return state.participants.every((participant) =>
    hasParticipantAnswered(state, cardId, participant.clientId)
  );
}

export function canStartSyncLobby(state: GroupState): boolean {
  return state.participants.length >= 2;
}

export const MAX_QUESTION_ANSWER_LENGTH = 300;

export function canAdvanceSyncCard(
  state: GroupState,
  card: Card | undefined
): boolean {
  if (!card) return false;
  return allParticipantsAnswered(state, card.id);
}

export function getParticipantAnswerLabel(
  answer: GroupAnswer | undefined,
  card: Card
): string | null {
  if (!answer) return null;
  if (card.type === "balance") {
    return answer.selectedLabel ?? answer.selectedOption ?? null;
  }
  const text = answer.answerText?.trim();
  if (text) {
    return text.length > 28 ? `${text.slice(0, 28)}…` : text;
  }
  return "답변 완료";
}
