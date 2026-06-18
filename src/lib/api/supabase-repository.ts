import { getPopularDecks as getMockPopularDecks } from "@/lib/data";
import { getSupabaseClient } from "@/lib/supabase/client";
import { mapCard, mapDeck, mapSituation } from "@/lib/supabase/mappers";
import { mockRepository } from "./repository";
import type { DataRepository } from "./types";

async function withFallback<T>(
  query: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  try {
    return await query();
  } catch (error) {
    console.error("[SupabaseRepository] falling back to mock:", error);
    return fallback();
  }
}

export const supabaseRepository: DataRepository = {
  getSituations: async () =>
    withFallback(async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return mockRepository.getSituations();

      const { data, error } = await supabase
        .from("situations")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return (data ?? []).map(mapSituation);
    }, mockRepository.getSituations),

  getSituationById: async (id) =>
    withFallback(async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return mockRepository.getSituationById(id);

      const { data, error } = await supabase
        .from("situations")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapSituation(data) : undefined;
    }, () => mockRepository.getSituationById(id)),

  getDecksBySituationId: async (situationId) =>
    withFallback(async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return mockRepository.getDecksBySituationId(situationId);

      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("situation_id", situationId)
        .order("sort_order");

      if (error) throw error;
      return (data ?? []).map(mapDeck);
    }, () => mockRepository.getDecksBySituationId(situationId)),

  getDeckById: async (id) =>
    withFallback(async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return mockRepository.getDeckById(id);

      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data ? mapDeck(data) : undefined;
    }, () => mockRepository.getDeckById(id)),

  getCardsByDeckId: async (deckId) =>
    withFallback(async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return mockRepository.getCardsByDeckId(deckId);

      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("deck_id", deckId)
        .order("sort_order");

      if (error) throw error;
      return (data ?? []).map(mapCard);
    }, () => mockRepository.getCardsByDeckId(deckId)),

  getPopularDecks: async () =>
    withFallback(async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return mockRepository.getPopularDecks();

      const popularIds = getMockPopularDecks().map((deck) => deck.id);
      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .in("id", popularIds);

      if (error) throw error;

      const decks = (data ?? []).map(mapDeck);
      return popularIds
        .map((id) => decks.find((deck) => deck.id === id))
        .filter((deck): deck is NonNullable<typeof deck> => deck !== undefined);
    }, mockRepository.getPopularDecks),

  getAllDecks: async () =>
    withFallback(async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return mockRepository.getAllDecks();

      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return (data ?? []).map(mapDeck);
    }, mockRepository.getAllDecks),
};
