import {
  getAllDecks,
  getAllSituations,
  getCardsByDeckId,
  getDeckById,
  getDecksBySituationId,
  getPopularDecks,
  getSituationById,
} from "@/lib/data";
import type { DataRepository } from "./types";

/** Mock 구현 — Supabase 연동 시 SupabaseRepository로 교체 */
export const mockRepository: DataRepository = {
  getSituations: async () => getAllSituations(),
  getSituationById: async (id) => getSituationById(id),
  getDecksBySituationId: async (situationId) =>
    getDecksBySituationId(situationId),
  getDeckById: async (id) => getDeckById(id),
  getCardsByDeckId: async (deckId) => getCardsByDeckId(deckId),
  getPopularDecks: async () => getPopularDecks(),
  getAllDecks: async () => getAllDecks(),
};
