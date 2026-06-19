"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { GroupMode } from "@/lib/group/types";
import {
  clearPlayStartCache,
  getCachedPlayStart,
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

  useEffect(() => {
    if (isLocked) return;
    prefetchPlayStart(deckId, "async");
    prefetchPlayStart(deckId, "sync");
    return () => clearPlayStartCache(deckId);
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

      try {
        const cached = getCachedPlayStart(deckId, mode);
        if (cached) {
          navigateToPlay(cached.targetPath);
          return true;
        }

        const ready = await resolvePlayStart(deckId, mode);
        navigateToPlay(ready.targetPath);
        return true;
      } catch {
        return false;
      } finally {
        navigatingRef.current = false;
      }
    },
    [deckId, isLocked, navigateToPlay]
  );

  return { warmStart, startPlay };
}
