"use client";

import { useEffect, useRef, useState } from "react";
import { LobbyPageSkeleton } from "@/components/group/lobby-page-skeleton";
import { RoomLobbyScreen } from "@/components/group/room-lobby-screen";
import { RouteFallback } from "@/components/layout/route-fallback";
import { getPlayDeckById } from "@/lib/data/play-content";
import { getGroupExpiredFallback } from "@/lib/group/group-access";
import { pollGroupState } from "@/lib/group/poll-group-state";
import { readPlayHandoff } from "@/lib/group/play-handoff";
import { saveGroupSessionToken } from "@/lib/group/session-storage";
import { setClientId } from "@/lib/client-id";
import { useInstantLobbyEntry } from "@/lib/hooks/use-instant-play-entry";
import type { GroupState } from "@/lib/group/types";

type RoomLobbyClientEntryProps = {
  groupId: string;
  sid?: string;
  st?: string;
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function RoomLobbyClientEntry({
  groupId,
  sid,
  st,
}: RoomLobbyClientEntryProps) {
  const instant = useInstantLobbyEntry(groupId);
  const latchedRef = useRef<{
    deckId: string;
    initialState: GroupState;
  } | null>(null);
  if (instant) latchedRef.current = instant;

  const [fallback, setFallback] = useState<{
    deckId: string;
    initialState: GroupState;
  } | null>(null);
  const [error, setError] = useState<"missing" | "expired" | null>(null);

  useEffect(() => {
    if (latchedRef.current) return;

    const clientId = sid?.trim();
    const sessionToken = st?.trim();
    if (!clientId || !sessionToken) {
      setError("missing");
      return;
    }

    setClientId(clientId);
    saveGroupSessionToken(groupId, sessionToken);

    let cancelled = false;

    void (async () => {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        if (cancelled) return;

        const result = await pollGroupState(groupId);
        if (cancelled) return;

        if (result.status === "ok") {
          if (result.state.group.mode !== "sync") {
            setError("missing");
            return;
          }
          setFallback({
            deckId: result.state.group.deckId,
            initialState: result.state,
          });
          return;
        }

        if (result.status === "missing") {
          setError("missing");
          return;
        }

        if (result.status === "expired") {
          setError("expired");
          return;
        }

        await sleep(400);
      }

      setError("missing");
    })();

    return () => {
      cancelled = true;
    };
  }, [groupId, instant, sid, st]);

  const payload = latchedRef.current ?? fallback;

  if (error === "expired") {
    return (
      <RouteFallback
        {...getGroupExpiredFallback(payload?.deckId ?? readPlayHandoff()?.deckId)}
      />
    );
  }

  if (error === "missing") {
    return (
      <RouteFallback
        title="방을 찾을 수 없어요"
        description="덱 상세에서 다시 시작해주세요."
        primaryHref="/home"
        primaryLabel="홈으로"
      />
    );
  }

  if (!payload) {
    return <LobbyPageSkeleton />;
  }

  const deck = getPlayDeckById(payload.deckId);
  if (!deck) {
    return (
      <RouteFallback
        title="덱을 찾을 수 없어요"
        primaryHref="/home"
        primaryLabel="홈으로"
      />
    );
  }

  return (
    <RoomLobbyScreen
      groupId={groupId}
      deck={deck}
      initialState={payload.initialState}
    />
  );
}
