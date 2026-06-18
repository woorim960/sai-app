export type AdvanceNextQuery = {
  groupId: string;
  cardIndex: number;
  totalCards: number;
  cardId: string;
  cardType: "balance" | "question";
  optionA?: string;
  optionB?: string;
  selectedOption?: "A" | "B" | null;
};

export function buildAdvanceNextHref(input: AdvanceNextQuery): string {
  const params = new URLSearchParams({
    cardIndex: String(input.cardIndex),
    totalCards: String(input.totalCards),
    cardId: input.cardId,
    cardType: input.cardType,
    optionA: input.optionA ?? "",
    optionB: input.optionB ?? "",
  });

  if (input.selectedOption === "A" || input.selectedOption === "B") {
    params.set("selectedOption", input.selectedOption);
  }

  return `/api/groups/${input.groupId}/advance-next?${params.toString()}`;
}
