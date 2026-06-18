"use client";

import type { GroupMode } from "@/lib/group/types";

const HANDOFF_KEY = "sai_play_handoff";

export type PlayHandoff = {
  groupId: string;
  deckId: string;
  mode: GroupMode;
  clientId: string;
  sessionToken: string;
  targetPath: string;
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
    if (Date.now() - parsed.createdAt > 60_000) {
      sessionStorage.removeItem(HANDOFF_KEY);
      return null;
    }
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
