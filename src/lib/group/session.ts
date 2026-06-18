import { createHmac, timingSafeEqual } from "crypto";

import { groupSessionCookieName } from "@/lib/cookies";
import type { NextRequest } from "next/server";

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type GroupSessionPayload = {
  groupId: string;
  clientId: string;
  exp: number;
};

function getSecret(): string {
  return (
    process.env.GROUP_SESSION_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "sai-dev-group-session-secret"
  );
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createGroupSessionToken(
  groupId: string,
  clientId: string
): string {
  const payload: GroupSessionPayload = {
    groupId,
    clientId,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${signPayload(encoded)}`;
}

export function verifyGroupSessionToken(
  token: string,
  groupId: string
): GroupSessionPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = signPayload(encoded);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as GroupSessionPayload;

    if (payload.groupId !== groupId) return null;
    if (!payload.clientId || payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export function readGroupSessionCookie(
  request: Request,
  groupId: string
): string | null {
  const cookieName = groupSessionCookieName(groupId);

  if ("cookies" in request) {
    const cookies = (request as NextRequest).cookies;
    const value = cookies?.get?.(cookieName)?.value;
    if (value?.trim()) return value.trim();
  }

  const header = request.headers.get("cookie");
  if (!header) return null;

  for (const part of header.split(";")) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(`${cookieName}=`)) continue;
    return decodeURIComponent(trimmed.slice(cookieName.length + 1)).trim();
  }

  return null;
}

/** Bearer 헤더 → 세션 쿠키 → 폼/쿼리 폴백 순으로 토큰 해석 */
export function resolveGroupSessionToken(
  request: Request,
  groupId: string,
  fallbackToken?: string | null
): string | null {
  return (
    extractBearerToken(request) ||
    readGroupSessionCookie(request, groupId) ||
    (fallbackToken?.trim() || null)
  );
}
