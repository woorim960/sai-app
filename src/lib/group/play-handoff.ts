"use client";

import { getClientId } from "@/lib/client-id";
import { getClientIdFromSessionToken } from "@/lib/group/session-client";
import { getGroupSessionToken } from "@/lib/group/session-storage";
import type { GroupMode, GroupState } from "@/lib/group/types";

const HANDOFF_KEY = "sai_play_handoff";

export type PlayHandoff = {
  groupId: string;
  deckId: string;
  mode: GroupMode;
  clientId: string;
  sessionToken: string;
  targetPath: string;
  initialState: GroupState;
  createdAt: number;
};

export function savePlayHandoff(handoff: PlayHandoff): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
}

export function readPlayHandoff(): PlayHandoff | null {
  if (typeof sessionStorage === "undefined") return null;
  const raw = sessionStorage.getItem(HANDOFF_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PlayHandoff;
    if (Date.now() - parsed.createdAt > 120_000) {
      sessionStorage.removeItem(HANDOFF_KEY);
      return null;
    }
    if (!parsed.initialState?.group?.id) return null;
    if (parsed.groupId !== parsed.initialState.group.id) return null;
    if (parsed.mode !== parsed.initialState.group.mode) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPlayHandoff(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(HANDOFF_KEY);
}

export function readUrlPlaySession(): {
  clientId: string;
  sessionToken: string;
} | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const clientId = params.get("sid")?.trim();
  const sessionToken = params.get("st")?.trim();
  if (!clientId || !sessionToken) return null;
  return { clientId, sessionToken };
}

/** URL → localStorage 순으로 플레이 세션 자격 증명 복구 */
export function resolvePlaySessionCredentials(
  groupId: string,
  sid?: string | null,
  st?: string | null
): { clientId: string; sessionToken: string } | null {
  const urlClientId = sid?.trim();
  const urlToken = st?.trim();
  if (urlClientId && urlToken) {
    return { clientId: urlClientId, sessionToken: urlToken };
  }

  const fromUrl = readUrlPlaySession();
  if (fromUrl) return fromUrl;

  const sessionToken = getGroupSessionToken(groupId);
  if (!sessionToken) return null;

  const clientId =
    getClientIdFromSessionToken(sessionToken) ?? getClientId();
  if (!clientId) return null;

  return { clientId, sessionToken };
}

export function appendPlayBootstrap(
  path: string,
  clientId: string,
  sessionToken: string
): string {
  const params = new URLSearchParams({ sid: clientId, st: sessionToken });
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${params.toString()}`;
}

export function saveJoinPlayHandoff(input: {
  groupId: string;
  state: GroupState;
  clientId: string;
  sessionToken: string;
  targetPath: string;
}): void {
  savePlayHandoff({
    groupId: input.groupId,
    deckId: input.state.group.deckId,
    mode: input.state.group.mode,
    clientId: input.clientId,
    sessionToken: input.sessionToken,
    initialState: input.state,
    targetPath: input.targetPath,
    createdAt: Date.now(),
  });
}
