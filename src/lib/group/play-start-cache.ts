"use client";

import {
  getClientId,
  getDefaultDisplayName,
  setClientId,
} from "@/lib/client-id";
import {
  CLIENT_ID_COOKIE,
  groupSessionCookieName,
  writeBrowserCookie,
} from "@/lib/cookies";
import { createGroupRequest } from "@/lib/group/api-client";
import type { CreateGroupResponse } from "@/lib/group/create-group-response";
import { savePlayHandoff } from "@/lib/group/play-handoff";
import { saveGroupSessionToken } from "@/lib/group/session-storage";
import type { GroupMode } from "@/lib/group/types";

const CACHE_TTL_MS = 12_000;

export type PlayStartReady = {
  groupId: string;
  targetPath: string;
};

type CacheEntry = {
  promise: Promise<PlayStartReady>;
  ready?: PlayStartReady;
  createdAt: number;
};

const cache = new Map<string, CacheEntry>();

function cacheKey(deckId: string, mode: GroupMode): string {
  return `${deckId}:${mode}`;
}

function buildTargetPath(
  groupId: string,
  mode: GroupMode,
  clientId: string,
  sessionToken: string
): string {
  const bootstrap = new URLSearchParams({
    sid: clientId,
    st: sessionToken,
  });
  return mode === "async"
    ? `/group/${groupId}/play?${bootstrap.toString()}`
    : `/room/${groupId}?${bootstrap.toString()}`;
}

function persistPlaySession(
  groupId: string,
  clientId: string,
  sessionToken: string
): void {
  setClientId(clientId);
  writeBrowserCookie(CLIENT_ID_COOKIE, clientId, 60 * 60 * 24 * 365);
  saveGroupSessionToken(groupId, sessionToken);
  writeBrowserCookie(groupSessionCookieName(groupId), sessionToken);
}

async function createPlaySession(
  deckId: string,
  mode: GroupMode
): Promise<PlayStartReady> {
  const clientId = getClientId();
  const data: CreateGroupResponse = await createGroupRequest({
    deckId,
    mode,
    clientId,
    displayName: getDefaultDisplayName(),
  });

  persistPlaySession(data.groupId, clientId, data.sessionToken);

  const targetPath = buildTargetPath(
    data.groupId,
    mode,
    clientId,
    data.sessionToken
  );

  savePlayHandoff({
    groupId: data.groupId,
    deckId,
    mode,
    clientId,
    sessionToken: data.sessionToken,
    targetPath,
    initialState: data.initialState,
    createdAt: Date.now(),
  });

  return {
    groupId: data.groupId,
    targetPath,
  };
}

function trackReady(key: string, promise: Promise<PlayStartReady>): Promise<PlayStartReady> {
  return promise.then((ready) => {
    const entry = cache.get(key);
    if (entry) entry.ready = ready;
    return ready;
  });
}

function isFresh(entry: CacheEntry): boolean {
  return Date.now() - entry.createdAt < CACHE_TTL_MS;
}

/** 터치/호버 시 미리 그룹 생성 — 클릭 시 즉시 이동 */
export function prefetchPlayStart(deckId: string, mode: GroupMode): void {
  const key = cacheKey(deckId, mode);
  const existing = cache.get(key);
  if (existing && isFresh(existing)) return;

  const promise = trackReady(key, createPlaySession(deckId, mode));
  cache.set(key, {
    createdAt: Date.now(),
    promise,
  });
}

/** prefetch 완료 시 클릭 즉시 이동 (await 없음) */
export function getCachedPlayStart(
  deckId: string,
  mode: GroupMode
): PlayStartReady | null {
  const key = cacheKey(deckId, mode);
  const entry = cache.get(key);
  if (!entry || !isFresh(entry) || !entry.ready) return null;
  return entry.ready;
}

export async function resolvePlayStart(
  deckId: string,
  mode: GroupMode
): Promise<PlayStartReady> {
  const key = cacheKey(deckId, mode);
  const existing = cache.get(key);

  if (existing && isFresh(existing)) {
    cache.delete(key);
    return existing.promise;
  }

  cache.delete(key);
  return createPlaySession(deckId, mode);
}

export function clearPlayStartCache(deckId?: string): void {
  if (!deckId) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(`${deckId}:`)) {
      cache.delete(key);
    }
  }
}
