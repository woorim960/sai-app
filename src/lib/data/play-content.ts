import { getCardsByDeckId, getDeckById } from "./helpers";
import type { Card, Deck } from "./types";

/**
 * 플레이 화면용 정적 콘텐츠 — Supabase와 동일하게 시드된 in-repo 데이터.
 * 게임플레이 라우트에서는 네트워크 왕복 없이 즉시 로드합니다.
 */
export function getPlayDeckById(deckId: string): Deck | undefined {
  return getDeckById(deckId);
}

export function getPlayCardsByDeckId(deckId: string): Card[] {
  return getCardsByDeckId(deckId);
}

export function hasPlayDeckCards(deckId: string): boolean {
  return getPlayCardsByDeckId(deckId).length > 0;
}
