import { CONVERSATION_PHASE_MESSAGES } from "./constants";
import { cards } from "./cards";
import { decks } from "./decks";
import { situations } from "./situations";
import type { CardPhase, Deck, DeckFilter, Situation } from "./types";

export function getSituationById(id: string): Situation | undefined {
  return situations.find((s) => s.id === id);
}

export function getAllSituations(): Situation[] {
  return [...situations].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getDecksBySituationId(situationId: string): Deck[] {
  return decks
    .filter((d) => d.situationId === situationId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getDeckById(id: string): Deck | undefined {
  return decks.find((d) => d.id === id);
}

export function getCardsByDeckId(deckId: string) {
  return cards
    .filter((c) => c.deckId === deckId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPopularDecks(): Deck[] {
  const popularIds = [
    "blind-ice-breaking",
    "friend-laugh",
    "some-flutter",
    "friend-closer",
  ];
  return popularIds
    .map((id) => getDeckById(id))
    .filter((deck): deck is Deck => deck !== undefined);
}

export function getAllDecks(): Deck[] {
  return [...decks].sort((a, b) => {
    const aOrder = getSituationById(a.situationId)?.sortOrder ?? 0;
    const bOrder = getSituationById(b.situationId)?.sortOrder ?? 0;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.sortOrder - b.sortOrder;
  });
}

const POPULAR_DECK_IDS = new Set([
  "blind-ice-breaking",
  "friend-laugh",
  "some-flutter",
  "friend-closer",
]);

export function filterDecks(deckList: Deck[], filter: DeckFilter): Deck[] {
  if (filter === "popular") {
    return deckList.filter((deck) => POPULAR_DECK_IDS.has(deck.id));
  }
  if (filter === "new") {
    return deckList.filter((deck) => deck.isNew);
  }
  return deckList;
}

export function getSituationByDeckId(deckId: string): Situation | undefined {
  const deck = getDeckById(deckId);
  if (!deck) return undefined;
  return getSituationById(deck.situationId);
}

export function getSituationListMessage(situation: Situation): string {
  return `${situation.subtitle} 대화할 수 있는 덱들이에요.`;
}

export function getConversationPreview(deckId: string): string[] {
  const deckCards = getCardsByDeckId(deckId);
  const seen = new Set<CardPhase>();
  const messages: string[] = [];

  for (const card of deckCards) {
    if (!seen.has(card.phase)) {
      seen.add(card.phase);
      messages.push(CONVERSATION_PHASE_MESSAGES[card.phase]);
    }
  }

  return messages;
}

export function formatEstimatedMinutes(minutes: number): string {
  return `${minutes}분`;
}
