"use client";

import { useSyncExternalStore } from "react";
import { readPlayHandoff } from "@/lib/group/play-handoff";
import type { GroupState } from "@/lib/group/types";

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

type LobbyCacheEntry = {
  key: string;
  payload: LobbyEntryPayload;
};

type PlayCacheEntry = {
  key: string;
  payload: PlayEntryPayload;
};

const lobbyCache = new Map<string, LobbyCacheEntry>();
const playCache = new Map<string, PlayCacheEntry>();

function noopSubscribe() {
  return () => {};
}

function getLobbySnapshot(groupId: string): LobbyEntryPayload | null {
  const handoff = readPlayHandoff();
  if (
    handoff?.groupId === groupId &&
    handoff.mode === "sync" &&
    handoff.initialState?.group?.mode === "sync" &&
    handoff.initialState
  ) {
    const key = `${handoff.createdAt}`;
    const cached = lobbyCache.get(groupId);
    if (cached?.key === key) return cached.payload;

    const payload: LobbyEntryPayload = {
      deckId: handoff.deckId,
      initialState: handoff.initialState,
    };
    lobbyCache.set(groupId, { key, payload });
    return payload;
  }

  lobbyCache.delete(groupId);
  return null;
}

function getPlaySnapshot(
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
    const clientId = sid ?? handoff.clientId;
    const sessionToken = st ?? handoff.sessionToken;
    const key = `${handoff.createdAt}:${clientId}:${sessionToken}`;
    const cached = playCache.get(groupId);
    if (cached?.key === key) return cached.payload;

    const payload: PlayEntryPayload = {
      deckId: handoff.deckId,
      initialState: handoff.initialState,
      clientId,
      sessionToken,
    };
    playCache.set(groupId, { key, payload });
    return payload;
  }

  playCache.delete(groupId);
  return null;
}

export function resolveInstantPlayEntry(
  groupId: string,
  sid?: string,
  st?: string
): PlayEntryPayload | null {
  return getPlaySnapshot(groupId, sid, st);
}

export function resolveInstantLobbyEntry(
  groupId: string
): LobbyEntryPayload | null {
  return getLobbySnapshot(groupId);
}

/** SSR은 null, 클라이언트 첫 렌더에서 sessionStorage handoff 즉시 읽기 */
export function useInstantPlayEntry(
  groupId: string,
  sid?: string,
  st?: string
): PlayEntryPayload | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => getPlaySnapshot(groupId, sid, st),
    () => null
  );
}

export function useInstantLobbyEntry(
  groupId: string
): LobbyEntryPayload | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => getLobbySnapshot(groupId),
    () => null
  );
}
