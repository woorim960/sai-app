import { buildCards } from "./card-builders";
import { deckCardInputs } from "./deck-card-inputs";
import type { Card } from "./types";

export const cards: Card[] = Object.entries(deckCardInputs).flatMap(
  ([deckId, inputs]) => buildCards(deckId, inputs)
);
