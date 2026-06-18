import type { Card, CardInput, CardPhase } from "./types";

export function buildCards(deckId: string, inputs: CardInput[]): Card[] {
  return inputs.map((input) => ({
    ...input,
    id: `${deckId}-${String(input.sortOrder).padStart(3, "0")}`,
    deckId,
  }));
}

export function balanceCard(
  phase: CardPhase,
  sortOrder: number,
  vsText: string,
  helperText: string
): CardInput {
  const [optionA, optionB] = vsText.split(" VS ");
  return {
    phase,
    type: "balance",
    sortOrder,
    question: vsText.trim(),
    optionA: optionA.trim(),
    optionB: optionB.trim(),
    helperText,
  };
}

export function questionCard(
  phase: CardPhase,
  sortOrder: number,
  question: string,
  helperText: string
): CardInput {
  return { phase, type: "question", sortOrder, question, helperText };
}
