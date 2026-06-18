"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { GroupMode } from "@/lib/group/types";
import {
  getCachedPlayStart,
  prefetchPlayStart,
  resolvePlayStart,
} from "@/lib/group/play-start-cache";
import {
  hidePlayNavigation,
  showPlayNavigation,
} from "@/lib/navigation/play-navigation-store";

type UseDeckPlayStartOptions = {
  deckId: string;
  isLocked: boolean;
};

export function useDeckPlayStart({ deckId, isLocked }: UseDeckPlayStartOptions) {
  const router = useRouter();
  const navigatingRef = useRef(false);

  // 덱 상세 진입 후 두 모드 모두 선제 생성
  useEffect(() => {
    if (isLocked) return;
    const timer = window.setTimeout(() => {
      prefetchPlayStart(deckId, "async");
      prefetchPlayStart(deckId, "sync");
    }, 300);
    return () => window.clearTimeout(timer);
  }, [deckId, isLocked]);

  const warmStart = useCallback(
    (mode: GroupMode) => {
      if (isLocked) return;
      prefetchPlayStart(deckId, mode);
    },
    [deckId, isLocked]
  );

  const navigateToPlay = useCallback(
    (targetPath: string) => {
      router.prefetch(targetPath);
      router.push(targetPath);
    },
    [router]
  );

  const startPlay = useCallback(
    async (mode: GroupMode): Promise<boolean> => {
      if (isLocked || navigatingRef.current) return false;

      navigatingRef.current = true;
      showPlayNavigation(mode);

      const cached = getCachedPlayStart(deckId, mode);
      if (cached) {
        navigateToPlay(cached.targetPath);
        return true;
      }

      try {
        const ready = await resolvePlayStart(deckId, mode);
        navigateToPlay(ready.targetPath);
        return true;
      } catch {
        hidePlayNavigation();
        navigatingRef.current = false;
        return false;
      }
    },
    [deckId, isLocked, navigateToPlay]
  );

  return { warmStart, startPlay };
}
