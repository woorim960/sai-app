import {
  groupSessionCookieName,
  readBrowserCookie,
  writeBrowserCookie,
} from "@/lib/cookies";

const SESSIONS_KEY = "sai_group_sessions";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

type SessionMap = Record<string, string>;

function readSessions(): SessionMap {
  if (!isBrowser()) return {};
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SessionMap;
  } catch {
    return {};
  }
}

function writeSessions(sessions: SessionMap): void {
  if (!isBrowser()) return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function saveGroupSessionToken(
  groupId: string,
  token: string
): void {
  const sessions = readSessions();
  sessions[groupId] = token;
  writeSessions(sessions);
  writeBrowserCookie(groupSessionCookieName(groupId), token);
}

export function getGroupSessionToken(groupId: string): string | null {
  const fromCookie = readBrowserCookie(groupSessionCookieName(groupId));
  if (fromCookie) {
    const sessions = readSessions();
    if (sessions[groupId] !== fromCookie) {
      sessions[groupId] = fromCookie;
      writeSessions(sessions);
    }
    return fromCookie;
  }

  return readSessions()[groupId] ?? null;
}
