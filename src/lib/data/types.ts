export type Situation = {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
  description: string;
  sortOrder: number;
};

export type Deck = {
  id: string;
  situationId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  moodLevel: string;
  cardCount: number;
  isPremium: boolean;
  isNew?: boolean;
  sortOrder: number;
};

export type DeckFilter = "all" | "popular" | "new";

export type CardPhase = "ice_breaking" | "taste" | "value" | "closing";

export type CardType = "balance" | "question";

export type Card = {
  id: string;
  deckId: string;
  phase: CardPhase;
  type: CardType;
  question: string;
  optionA?: string;
  optionB?: string;
  helperText: string;
  sortOrder: number;
};

export type CardInput = Omit<Card, "id" | "deckId">;
