"use client";

import { useSyncExternalStore } from "react";
import type { GroupState } from "@/lib/group/types";
import { readPlayHandoff } from "@/lib/group/play-handoff";

export type PlayEntryPayload = {
  deckId: string;
  initialState: GroupState;
  clientId: string;
  sessionToken: string;
};

export type LobbyEntryPayload = {
  deckId: string;
  initialState: GroupState;
};

function noopSubscribe() {
  return () => {};
}

export function resolveInstantPlayEntry(
  groupId: string,
  sid?: string,
  st?: string
): PlayEntryPayload | null {
  const handoff = readPlayHandoff();
  if (
    handoff?.groupId === groupId &&
    handoff.mode === "async" &&
    handoff.initialState?.group?.mode === "async" &&
    handoff.initialState
  ) {
    return {
      deckId: handoff.deckId,
      initialState: handoff.initialState,
      clientId: sid ?? handoff.clientId,
      sessionToken: st ?? handoff.sessionToken,
    };
  }
  return null;
}

export function resolveInstantLobbyEntry(
  groupId: string
): LobbyEntryPayload | null {
  const handoff = readPlayHandoff();
  if (
    handoff?.groupId === groupId &&
    handoff.mode === "sync" &&
    handoff.initialState?.group?.mode === "sync" &&
    handoff.initialState
  ) {
    return {
      deckId: handoff.deckId,
      initialState: handoff.initialState,
    };
  }
  return null;
}

/** SSR은 null, 클라이언트 첫 렌더에서 sessionStorage handoff 즉시 읽기 */
export function useInstantPlayEntry(
  groupId: string,
  sid?: string,
  st?: string
): PlayEntryPayload | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => resolveInstantPlayEntry(groupId, sid, st),
    () => null
  );
}

export function useInstantLobbyEntry(
  groupId: string
): LobbyEntryPayload | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => resolveInstantLobbyEntry(groupId),
    () => null
  );
}
