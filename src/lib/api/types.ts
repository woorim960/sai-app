import type { Card, Deck, Situation } from "@/lib/data";

export interface DataRepository {
  getSituations(): Promise<Situation[]>;
  getSituationById(id: string): Promise<Situation | undefined>;
  getDecksBySituationId(situationId: string): Promise<Deck[]>;
  getDeckById(id: string): Promise<Deck | undefined>;
  getCardsByDeckId(deckId: string): Promise<Card[]>;
  getPopularDecks(): Promise<Deck[]>;
  getAllDecks(): Promise<Deck[]>;
}
