"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GroupPlayPage } from "@/components/group/group-play-page";
import { RouteFallback } from "@/components/layout/route-fallback";
import {
  getPlayCardsByDeckId,
  getPlayDeckById,
} from "@/lib/data/play-content";
import { getPlayAccessFallback } from "@/lib/deck-access";
import { getGroupExpiredFallback } from "@/lib/group/group-access";
import { pollGroupState } from "@/lib/group/poll-group-state";
import { readPlayHandoff } from "@/lib/group/play-handoff";
import { buildTrustedPlayBootstrap } from "@/lib/group/play-bootstrap";
import { saveGroupSessionToken } from "@/lib/group/session-storage";
import { setClientId } from "@/lib/client-id";
import type { GroupState } from "@/lib/group/types";

type GroupPlayClientEntryProps = {
  groupId: string;
  sid?: string;
  st?: string;
};

type EntryPayload = {
  deckId: string;
  initialState: GroupState;
  clientId: string;
  sessionToken: string;
};

function buildEntryPayload(
  state: GroupState,
  clientId: string,
  sessionToken: string
): EntryPayload {
  return {
    deckId: state.group.deckId,
    initialState: state,
    clientId,
    sessionToken,
  };
}

function resolveInstantEntry(
  groupId: string,
  sid?: string,
  st?: string
): EntryPayload | null {
  const handoff = readPlayHandoff();
  if (
    handoff?.groupId === groupId &&
    handoff.mode === "async" &&
    handoff.initialState
  ) {
    return buildEntryPayload(
      handoff.initialState,
      sid ?? handoff.clientId,
      st ?? handoff.sessionToken
    );
  }
  return null;
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
  const instantEntry = useMemo(
    () => resolveInstantEntry(groupId, sid, st),
    [groupId, sid, st]
  );
  const [fallbackEntry, setFallbackEntry] = useState<EntryPayload | null>(null);
  const [fallbackError, setFallbackError] = useState<
    "missing" | "expired" | null
  >(null);

  useEffect(() => {
    if (instantEntry) return;

    const clientId = sid?.trim();
    const sessionToken = st?.trim();
    if (!clientId || !sessionToken) {
      setFallbackError("missing");
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

  const entry = instantEntry ?? fallbackEntry;

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
        description="덱 상세에서 다시 시작해주세요."
        primaryHref="/home"
        primaryLabel="홈으로"
      />
    );
  }

  if (!entry) return null;

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
    return null;
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
