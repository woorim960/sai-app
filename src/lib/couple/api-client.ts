import { getClientId } from "@/lib/client-id";
import {
  getCoupleSession,
  saveCoupleSession,
} from "@/lib/couple/session-storage";
import type { CoupleStatePublic } from "@/lib/couple/types";

type CoupleStateResponse = CoupleStatePublic & { sessionToken?: string };

function authHeaders(): HeadersInit {
  const session = getCoupleSession();
  const clientId = getClientId();
  return {
    "Content-Type": "application/json",
    ...(session ? { Authorization: `Bearer ${session.token}` } : {}),
    ...(clientId ? { "x-client-id": clientId } : {}),
  };
}

function persist(data: CoupleStateResponse): CoupleStatePublic {
  if (data.sessionToken) {
    saveCoupleSession({ coupleId: data.couple.id, token: data.sessionToken });
  }
  const { sessionToken: _sessionToken, ...state } = data;
  return state;
}

export async function createCoupleRequest(input: {
  displayName: string;
  emoji?: string;
  coupleName?: string;
  anniversary?: string;
}): Promise<CoupleStatePublic> {
  const res = await fetch("/api/couples", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, clientId: getClientId() }),
  });
  if (!res.ok) throw new Error("Failed to create couple");
  return persist((await res.json()) as CoupleStateResponse);
}

export async function joinCoupleRequest(input: {
  inviteCode: string;
  displayName: string;
  emoji?: string;
}): Promise<CoupleStatePublic> {
  const res = await fetch("/api/couples/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, clientId: getClientId() }),
  });
  if (res.status === 404) throw new Error("초대 코드를 찾을 수 없어요");
  if (res.status === 409) throw new Error("이미 두 명이 연결된 커플이에요");
  if (!res.ok) throw new Error("Failed to join couple");
  return persist((await res.json()) as CoupleStateResponse);
}

export async function fetchCoupleState(
  coupleId: string
): Promise<CoupleStatePublic | null> {
  const res = await fetch(`/api/couples/${coupleId}`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (res.status === 401 || res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch couple");
  return (await res.json()) as CoupleStatePublic;
}

export async function addCoupleRecordRequest(input: {
  coupleId: string;
  deckId: string;
  deckTitle: string;
  mode: "async" | "sync" | "duo" | "quiz";
  minutes: number;
  score?: number;
  note?: string;
}): Promise<CoupleStatePublic | null> {
  const res = await fetch(`/api/couples/${input.coupleId}/records`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) return null;
  const state = (await res.json()) as CoupleStatePublic;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("sai-couple-changed"));
  }
  return state;
}

export async function updateCoupleProfileRequest(input: {
  coupleId: string;
  coupleName?: string;
  anniversary?: string;
}): Promise<CoupleStatePublic | null> {
  const res = await fetch(`/api/couples/${input.coupleId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(input),
  });
  if (!res.ok) return null;
  return (await res.json()) as CoupleStatePublic;
}
