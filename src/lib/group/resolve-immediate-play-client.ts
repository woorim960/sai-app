"use client";

import type { PlayBootstrap } from "@/lib/group/play-bootstrap";
import {
  readPlayHandoff,
  readUrlPlaySession,
} from "@/lib/group/play-handoff";
import { saveGroupSessionToken } from "@/lib/group/session-storage";
import { setClientId } from "@/lib/client-id";

export type ImmediatePlayClient = {
  clientId: string;
  ready: boolean;
};

/** 렌더 중 호출 가능 — storage/cookie 쓰기 없음 */
export function peekImmediatePlayClient(
  groupId: string,
  bootstrap: PlayBootstrap | null
): ImmediatePlayClient {
  if (bootstrap?.sessionReady && bootstrap.clientId) {
    return { clientId: bootstrap.clientId, ready: true };
  }

  const fromUrl = readUrlPlaySession();
  if (fromUrl) {
    return { clientId: fromUrl.clientId, ready: true };
  }

  const handoff = readPlayHandoff();
  if (handoff?.groupId === groupId && handoff.clientId && handoff.sessionToken) {
    return { clientId: handoff.clientId, ready: true };
  }

  return { clientId: bootstrap?.clientId ?? "", ready: false };
}

/** useLayoutEffect에서 1회 호출 — 세션 저장 */
export function applyImmediatePlayClient(
  groupId: string,
  bootstrap: PlayBootstrap | null
): ImmediatePlayClient {
  const peeked = peekImmediatePlayClient(groupId, bootstrap);
  if (!peeked.ready) return peeked;

  if (bootstrap?.sessionReady && bootstrap.clientId) {
    setClientId(bootstrap.clientId);
    saveGroupSessionToken(groupId, bootstrap.sessionToken);
    return peeked;
  }

  const fromUrl = readUrlPlaySession();
  if (fromUrl) {
    setClientId(fromUrl.clientId);
    saveGroupSessionToken(groupId, fromUrl.sessionToken);
    return peeked;
  }

  const handoff = readPlayHandoff();
  if (handoff?.groupId === groupId && handoff.clientId && handoff.sessionToken) {
    setClientId(handoff.clientId);
    saveGroupSessionToken(groupId, handoff.sessionToken);
    return peeked;
  }

  return peeked;
}
