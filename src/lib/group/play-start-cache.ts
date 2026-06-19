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
import {
  clearPlayHandoff,
  savePlayHandoff,
  type PlayHandoff,
} from "@/lib/group/play-handoff";
import { saveGroupSessionToken } from "@/lib/group/session-storage";
import type { GroupMode } from "@/lib/group/types";

const CACHE_TTL_MS = 12_000;

export type PlayStartReady = {
  groupId: string;
  targetPath: string;
};

type PlayStartPayload = PlayStartReady & {
  handoff: PlayHandoff;
};

type CacheEntry = {
  promise: Promise<PlayStartPayload>;
  ready?: PlayStartPayload;
  createdAt: number;
};

const cache = new Map<string, CacheEntry>();

function cacheKey(deckId: string, mode: GroupMode): string {
  return `${deckId}:${mode}`;
}

function otherMode(mode: GroupMode): GroupMode {
  return mode === "async" ? "sync" : "async";
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

function buildHandoff(
  data: CreateGroupResponse,
  deckId: string,
  mode: GroupMode,
  clientId: string,
  targetPath: string
): PlayHandoff {
  return {
    groupId: data.groupId,
    deckId,
    mode,
    clientId,
    sessionToken: data.sessionToken,
    targetPath,
    initialState: data.initialState,
    createdAt: Date.now(),
  };
}

async function createPlaySession(
  deckId: string,
  mode: GroupMode
): Promise<PlayStartPayload> {
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

  return {
    groupId: data.groupId,
    targetPath,
    handoff: buildHandoff(data, deckId, mode, clientId, targetPath),
  };
}

function trackReady(
  key: string,
  promise: Promise<PlayStartPayload>
): Promise<PlayStartPayload> {
  return promise.then((ready) => {
    const entry = cache.get(key);
    if (entry) entry.ready = ready;
    return ready;
  });
}

function isFresh(entry: CacheEntry): boolean {
  return Date.now() - entry.createdAt < CACHE_TTL_MS;
}

/** prefetch만으로는 handoff를 쓰지 않음 — 클릭(consume) 시에만 반영 */
function commitPlayStart(payload: PlayStartPayload): PlayStartReady {
  clearPlayHandoff();
  savePlayHandoff(payload.handoff);
  persistPlaySession(
    payload.groupId,
    payload.handoff.clientId,
    payload.handoff.sessionToken
  );
  return {
    groupId: payload.groupId,
    targetPath: payload.targetPath,
  };
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

/** prefetch 완료 여부만 확인 (캐시 소비 없음) */
export function peekCachedPlayStart(
  deckId: string,
  mode: GroupMode
): boolean {
  const key = cacheKey(deckId, mode);
  const entry = cache.get(key);
  return Boolean(entry && isFresh(entry) && entry.ready);
}

/** prefetch 완료 시 클릭 즉시 이동 (await 없음) */
export function getCachedPlayStart(
  deckId: string,
  mode: GroupMode
): PlayStartReady | null {
  const key = cacheKey(deckId, mode);
  const entry = cache.get(key);
  if (!entry || !isFresh(entry) || !entry.ready) return null;

  cache.delete(key);
  cache.delete(cacheKey(deckId, otherMode(mode)));
  return commitPlayStart(entry.ready);
}

export async function resolvePlayStart(
  deckId: string,
  mode: GroupMode
): Promise<PlayStartReady> {
  const key = cacheKey(deckId, mode);
  const existing = cache.get(key);

  cache.delete(cacheKey(deckId, otherMode(mode)));

  if (existing && isFresh(existing)) {
    cache.delete(key);
    const payload = await existing.promise;
    return commitPlayStart(payload);
  }

  cache.delete(key);
  const payload = await createPlaySession(deckId, mode);
  return commitPlayStart(payload);
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
