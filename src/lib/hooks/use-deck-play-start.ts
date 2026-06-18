"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { GroupMode } from "@/lib/group/types";
import {
  prefetchPlayStart,
  resolvePlayStart,
} from "@/lib/group/play-start-cache";

type UseDeckPlayStartOptions = {
  deckId: string;
  isLocked: boolean;
};

export function useDeckPlayStart({ deckId, isLocked }: UseDeckPlayStartOptions) {
  const router = useRouter();
  const navigatingRef = useRef(false);

  // 덱 상세 진입 후 각자하기(주요 CTA) 선제 생성
  useEffect(() => {
    if (isLocked) return;
    const timer = window.setTimeout(() => {
      prefetchPlayStart(deckId, "async");
    }, 400);
    return () => window.clearTimeout(timer);
  }, [deckId, isLocked]);

  const warmStart = useCallback(
    (mode: GroupMode) => {
      if (isLocked) return;
      prefetchPlayStart(deckId, mode);
    },
    [deckId, isLocked]
  );

  const startPlay = useCallback(
    async (mode: GroupMode): Promise<boolean> => {
      if (isLocked || navigatingRef.current) return false;

      navigatingRef.current = true;

      try {
        const ready = await resolvePlayStart(deckId, mode);
        router.prefetch(ready.targetPath);
        router.push(ready.targetPath);
        return true;
      } catch {
        navigatingRef.current = false;
        return false;
      }
    },
    [deckId, isLocked, router]
  );

  return { warmStart, startPlay };
}
