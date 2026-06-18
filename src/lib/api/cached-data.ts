import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getRepository } from "@/lib/api";
import type { Card, Deck } from "@/lib/data";

/** 동일 요청 내 중복 조회 제거 (generateMetadata + page 등) */
export const getDeckByIdCached = cache(async (deckId: string): Promise<Deck | undefined> => {
  return getRepository().getDeckById(deckId);
});

/** 덱 카드는 거의 변하지 않으므로 서버에서 1시간 캐시 */
export function getCardsByDeckIdCached(deckId: string): Promise<Card[]> {
  return unstable_cache(
    async () => getRepository().getCardsByDeckId(deckId),
    ["deck-cards", deckId],
    { revalidate: 3600, tags: [`deck-cards-${deckId}`] }
  )();
}
