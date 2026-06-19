"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GameplayPageSkeleton } from "@/components/gameplay/gameplay-page-skeleton";
import { GroupPlayPage } from "@/components/group/group-play-page";
import { RouteFallback } from "@/components/layout/route-fallback";
import {
  getPlayCardsByDeckId,
  getPlayDeckById,
} from "@/lib/data/play-content";
import { getPlayAccessFallback } from "@/lib/deck-access";
import { getGroupExpiredFallback } from "@/lib/group/group-access";
import { pollGroupState } from "@/lib/group/poll-group-state";
import { readPlayHandoff, resolvePlaySessionCredentials } from "@/lib/group/play-handoff";
import { buildTrustedPlayBootstrap } from "@/lib/group/play-bootstrap";
import { saveGroupSessionToken } from "@/lib/group/session-storage";
import { setClientId } from "@/lib/client-id";
import {
  useInstantPlayEntry,
  type PlayEntryPayload,
} from "@/lib/hooks/use-instant-play-entry";
import type { GroupState } from "@/lib/group/types";

type GroupPlayClientEntryProps = {
  groupId: string;
  sid?: string;
  st?: string;
};

function buildEntryPayload(
  state: GroupState,
  clientId: string,
  sessionToken: string
): PlayEntryPayload {
  return {
    deckId: state.group.deckId,
    initialState: state,
    clientId,
    sessionToken,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function GroupPlayClientEntry({
  groupId,
  sid,
  st,
}: GroupPlayClientEntryProps) {
  const router = useRouter();
  const instantEntry = useInstantPlayEntry(groupId, sid, st);
  const latchedEntryRef = useRef<PlayEntryPayload | null>(null);
  if (instantEntry) latchedEntryRef.current = instantEntry;

  const [fallbackEntry, setFallbackEntry] = useState<PlayEntryPayload | null>(
    null
  );
  const [fallbackError, setFallbackError] = useState<
    "missing" | "expired" | null
  >(null);

  useEffect(() => {
    const credentials = resolvePlaySessionCredentials(groupId, sid, st);
    if (!credentials) {
      if (!latchedEntryRef.current) setFallbackError("missing");
      return;
    }

    const { clientId, sessionToken } = credentials;
    setClientId(clientId);
    saveGroupSessionToken(groupId, sessionToken);

    if (latchedEntryRef.current) return;

    let cancelled = false;

    void (async () => {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        if (cancelled) return;

        const result = await pollGroupState(groupId);
        if (cancelled) return;

        if (result.status === "ok") {
          if (result.state.group.mode !== "async") {
            setFallbackError("missing");
            return;
          }
          setFallbackEntry(
            buildEntryPayload(result.state, clientId, sessionToken)
          );
          return;
        }

        if (result.status === "missing") {
          setFallbackError("missing");
          return;
        }

        if (result.status === "expired") {
          setFallbackError("expired");
          return;
        }

        await sleep(400);
      }

      setFallbackError("missing");
    })();

    return () => {
      cancelled = true;
    };
  }, [groupId, instantEntry, sid, st]);

  const entry = latchedEntryRef.current ?? fallbackEntry;

  if (fallbackError === "expired") {
    const handoff = readPlayHandoff();
    return (
      <RouteFallback
        {...getGroupExpiredFallback(handoff?.deckId ?? entry?.deckId)}
      />
    );
  }

  if (fallbackError === "missing") {
    return (
      <RouteFallback
        title="플레이를 찾을 수 없어요"
        description="초대 링크에서 다시 참여하거나, 덱 상세에서 새로 시작해주세요."
        primaryHref="/home"
        primaryLabel="홈으로"
      />
    );
  }

  if (!entry) {
    return <GameplayPageSkeleton />;
  }

  const deck = getPlayDeckById(entry.deckId);
  const cards = getPlayCardsByDeckId(entry.deckId);

  if (!deck) {
    return (
      <RouteFallback
        title="덱을 찾을 수 없어요"
        primaryHref="/home"
        primaryLabel="홈으로"
      />
    );
  }

  if (cards.length === 0) {
    return <RouteFallback {...getPlayAccessFallback("no_cards", deck)} />;
  }

  const bootstrap = buildTrustedPlayBootstrap(
    entry.initialState,
    cards.length,
    entry.clientId,
    entry.sessionToken
  );

  if (bootstrap?.completed) {
    router.replace(`/group/${groupId}/result`);
    return <GameplayPageSkeleton />;
  }

  return (
    <GroupPlayPage
      groupId={groupId}
      deck={deck}
      cards={cards}
      resultPath={`/group/${groupId}/result`}
      initialState={entry.initialState}
      bootstrap={bootstrap}
    />
  );
}
