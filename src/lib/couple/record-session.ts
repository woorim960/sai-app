import { addCoupleRecordRequest } from "./api-client";
import { getCoupleSession } from "./session-storage";
import type { CoupleRecordMode } from "./types";

/**
 * 커플 세션이 존재할 때만 "우리"의 공유 기록에 플레이 결과를 적립한다.
 * 실패해도 일반 플레이 흐름을 막지 않도록 조용히 무시한다.
 */
export async function recordCoupleSessionIfPaired(input: {
  deckId: string;
  deckTitle: string;
  mode: CoupleRecordMode;
  minutes: number;
  score?: number;
}): Promise<void> {
  const session = getCoupleSession();
  if (!session) return;

  try {
    await addCoupleRecordRequest({ coupleId: session.coupleId, ...input });
  } catch {
    /* 기록 적립 실패는 무시 */
  }
}
