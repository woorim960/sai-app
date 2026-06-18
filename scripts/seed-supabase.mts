import { createClient } from "@supabase/supabase-js";
import { cards } from "../src/lib/data/cards";
import { decks } from "../src/lib/data/decks";
import { situations } from "../src/lib/data/situations";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to seed."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seed() {
  const { error: situationError } = await supabase.from("situations").upsert(
    situations.map((s) => ({
      id: s.id,
      emoji: s.emoji,
      name: s.name,
      subtitle: s.subtitle,
      description: s.description,
      sort_order: s.sortOrder,
    }))
  );
  if (situationError) throw situationError;

  const { error: deckError } = await supabase.from("decks").upsert(
    decks.map((d) => ({
      id: d.id,
      situation_id: d.situationId,
      title: d.title,
      description: d.description,
      estimated_minutes: d.estimatedMinutes,
      mood_level: d.moodLevel,
      card_count: d.cardCount,
      is_premium: d.isPremium,
      sort_order: d.sortOrder,
    }))
  );
  if (deckError) throw deckError;

  const { error: cardError } = await supabase.from("cards").upsert(
    cards.map((c) => ({
      id: c.id,
      deck_id: c.deckId,
      phase: c.phase,
      type: c.type,
      question: c.question,
      option_a: c.optionA ?? null,
      option_b: c.optionB ?? null,
      helper_text: c.helperText,
      sort_order: c.sortOrder,
    }))
  );
  if (cardError) throw cardError;

  console.log(
    `✓ Seeded ${situations.length} situations, ${decks.length} decks, ${cards.length} cards`
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
