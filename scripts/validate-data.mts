import { decks } from "../src/lib/data/decks";
import { cards } from "../src/lib/data/cards";
import { deckCardInputs } from "../src/lib/data/deck-card-inputs";

let failed = 0;

function fail(message: string): void {
  console.error(`✗ ${message}`);
  failed += 1;
}

function pass(message: string): void {
  console.log(`✓ ${message}`);
}

for (const deck of decks) {
  const deckCards = cards.filter((c) => c.deckId === deck.id);
  const inputCount = deckCardInputs[deck.id]?.length ?? 0;

  if (deckCards.length !== deck.cardCount) {
    fail(
      `Deck "${deck.id}": cardCount=${deck.cardCount}, actual=${deckCards.length}`
    );
  }

  if (inputCount !== deck.cardCount) {
    fail(
      `Deck "${deck.id}": deckCardInputs has ${inputCount}, expected ${deck.cardCount}`
    );
  }

  const sortOrders = deckCards.map((c) => c.sortOrder).sort((a, b) => a - b);
  const expected = Array.from({ length: deck.cardCount }, (_, i) => i + 1);

  if (JSON.stringify(sortOrders) !== JSON.stringify(expected)) {
    fail(
      `Deck "${deck.id}": sortOrder must be 1..${deck.cardCount}, got [${sortOrders.join(", ")}]`
    );
  }

  for (const card of deckCards) {
    if (card.type === "balance" && (!card.optionA || !card.optionB)) {
      fail(`Card "${card.id}": balance type requires optionA and optionB`);
    }

    if (!card.question?.trim()) {
      fail(`Card "${card.id}": question is empty`);
    }
  }
}

if (cards.length !== 180) {
  fail(`Total cards: expected 180, got ${cards.length}`);
}

if (failed === 0) {
  pass(`All ${decks.length} decks and ${cards.length} cards validated`);
  process.exit(0);
} else {
  console.error(`\n${failed} validation error(s)`);
  process.exit(1);
}
