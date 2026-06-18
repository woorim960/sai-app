import { balanceGroupName, readBalanceSelection } from "@/lib/gameplay/balance-dom";
import { resolvePlayClientId } from "@/lib/group/resolve-play-session";
import {
  advanceAsyncGroupPlay,
  type AdvanceAsyncPlayInput,
  type AdvanceAsyncPlayOutcome,
} from "@/lib/group/advance-async-play";
import type { Card, Deck } from "@/lib/data";
import type { PlayBootstrap } from "@/lib/group/play-bootstrap";

export function buildAdvanceAsyncInput(input: {
  groupId: string;
  deck: Deck;
  cards: Card[];
  currentIndex: number;
  currentCard: Card;
  selectedOption: "A" | "B" | null;
  resultPath: string;
  clientId: string;
  bootstrap: PlayBootstrap | null;
}): AdvanceAsyncPlayInput | null {
  const effectiveClientId =
    input.clientId ||
    resolvePlayClientId(input.groupId) ||
    input.bootstrap?.clientId ||
    "";

  if (!effectiveClientId) return null;

  const effectiveSelection =
    input.currentCard.type === "balance"
      ? input.selectedOption ??
        readBalanceSelection(balanceGroupName(input.currentCard.id))
      : input.selectedOption;

  return {
    groupId: input.groupId,
    clientId: effectiveClientId,
    deckId: input.deck.id,
    deckTitle: input.deck.title,
    estimatedMinutes: input.deck.estimatedMinutes,
    currentIndex: input.currentIndex,
    totalCards: input.cards.length,
    cardId: input.currentCard.id,
    cardType: input.currentCard.type,
    optionA: input.currentCard.optionA,
    optionB: input.currentCard.optionB,
    selectedOption: effectiveSelection,
    resultPath: input.resultPath,
  };
}

export async function runAdvanceAsyncPlay(
  input: AdvanceAsyncPlayInput
): Promise<AdvanceAsyncPlayOutcome> {
  return advanceAsyncGroupPlay(input);
}
