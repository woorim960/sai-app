import type { Card, Deck, Situation } from "@/lib/data";

type SituationRow = {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
  description: string;
  sort_order: number;
};

type DeckRow = {
  id: string;
  situation_id: string;
  title: string;
  description: string;
  estimated_minutes: number;
  mood_level: string;
  card_count: number;
  is_premium: boolean;
  sort_order: number;
};

type CardRow = {
  id: string;
  deck_id: string;
  phase: Card["phase"];
  type: Card["type"];
  question: string;
  option_a: string | null;
  option_b: string | null;
  helper_text: string;
  sort_order: number;
};

export function mapSituation(row: SituationRow): Situation {
  return {
    id: row.id,
    emoji: row.emoji,
    name: row.name,
    subtitle: row.subtitle,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

export function mapDeck(row: DeckRow): Deck {
  return {
    id: row.id,
    situationId: row.situation_id,
    title: row.title,
    description: row.description,
    estimatedMinutes: row.estimated_minutes,
    moodLevel: row.mood_level,
    cardCount: row.card_count,
    isPremium: row.is_premium,
    sortOrder: row.sort_order,
  };
}

export function mapCard(row: CardRow): Card {
  return {
    id: row.id,
    deckId: row.deck_id,
    phase: row.phase,
    type: row.type,
    question: row.question,
    optionA: row.option_a ?? undefined,
    optionB: row.option_b ?? undefined,
    helperText: row.helper_text,
    sortOrder: row.sort_order,
  };
}

export type { SituationRow, DeckRow, CardRow };
