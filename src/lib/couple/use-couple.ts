"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCoupleState } from "./api-client";
import { getCoupleSession } from "./session-storage";
import type { CoupleStatePublic } from "./types";

export type UseCoupleResult = {
  state: CoupleStatePublic | null;
  loading: boolean;
  /** 두 명이 모두 연결된 상태 */
  paired: boolean;
  /** 커플 세션(생성/참여 기록)이 존재하는 상태 */
  hasCouple: boolean;
  refresh: () => Promise<void>;
};

export function useCouple(): UseCoupleResult {
  const [state, setState] = useState<CoupleStatePublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExists, setSessionExists] = useState(false);

  const refresh = useCallback(async () => {
    const session = getCoupleSession();
    setSessionExists(Boolean(session));

    if (!session) {
      setState(null);
      setLoading(false);
      return;
    }

    try {
      const next = await fetchCoupleState(session.coupleId);
      setState(next);
    } catch {
      setState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const handler = () => void refresh();
    window.addEventListener("sai-couple-changed", handler);
    return () => window.removeEventListener("sai-couple-changed", handler);
  }, [refresh]);

  return {
    state,
    loading,
    paired: (state?.members.length ?? 0) >= 2,
    hasCouple: sessionExists,
    refresh,
  };
}
