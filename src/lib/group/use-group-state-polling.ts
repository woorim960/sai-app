"use client";

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { pollGroupState } from "@/lib/group/poll-group-state";
import { isSameGroupState } from "@/lib/group/state-equality";
import type { GroupState } from "@/lib/group/types";

type UseGroupStatePollingOptions = {
  enabled?: boolean;
  intervalMs?: number;
  /** 탭이 백그라운드일 때 폴링 간격 (기본: intervalMs × 4) */
  hiddenIntervalMs?: number;
  pollOnMount?: boolean;
  refetchOnVisible?: boolean;
  /** true이면 이번 폴링 사이클을 건너뜀 (입력 중 등) */
  isPausedRef?: React.MutableRefObject<boolean>;
  onUpdate?: (next: GroupState, prev: GroupState) => void;
};

export function useGroupStatePolling(
  groupId: string,
  setState: Dispatch<SetStateAction<GroupState>>,
  options: UseGroupStatePollingOptions = {}
): void {
  const {
    enabled = true,
    intervalMs = 3000,
    hiddenIntervalMs,
    pollOnMount = true,
    refetchOnVisible = true,
    isPausedRef,
    onUpdate,
  } = options;
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    if (!enabled) return;

    const hiddenMs = hiddenIntervalMs ?? intervalMs * 4;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const getDelay = () =>
      typeof document !== "undefined" &&
      document.visibilityState === "hidden"
        ? hiddenMs
        : intervalMs;

    let missingPolls = 0;

    const poll = () => {
      if (isPausedRef?.current) return;

      void pollGroupState(groupId)
        .then((result) => {
          if (cancelled || isPausedRef?.current) return;

          if (result.status === "missing" || result.status === "expired") {
            missingPolls += 1;
            if (missingPolls >= 2) {
              window.location.replace("/home");
            }
            return;
          }

          if (result.status !== "ok") return;

          missingPolls = 0;
          const next = result.state;

          setState((prev) => {
            if (isSameGroupState(prev, next)) return prev;
            onUpdateRef.current?.(next, prev);
            return next;
          });
        })
        .catch(() => {});
    };

    const scheduleNext = () => {
      if (cancelled) return;
      timerId = setTimeout(() => {
        poll();
        scheduleNext();
      }, getDelay());
    };

    if (pollOnMount) poll();
    scheduleNext();

    const onVisibilityChange = () => {
      if (cancelled || !refetchOnVisible) return;
      if (timerId) clearTimeout(timerId);
      if (document.visibilityState === "visible") {
        poll();
      }
      scheduleNext();
    };

    if (refetchOnVisible) {
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
      if (refetchOnVisible) {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
    };
  }, [
    enabled,
    groupId,
    intervalMs,
    hiddenIntervalMs,
    pollOnMount,
    refetchOnVisible,
    setState,
  ]);
}
