import type { GroupRepository } from "./repository-types";
import {
  resolveGroupSessionToken,
  verifyGroupSessionToken,
  type GroupSessionPayload,
} from "./session";
import type { GroupState } from "./types";

export type AuthResult =
  | { ok: true; payload: GroupSessionPayload; state: GroupState }
  | { ok: false; status: number; error: string };

export type TokenAuthResult =
  | { ok: true; payload: GroupSessionPayload }
  | { ok: false; status: number; error: string };

/** JWT만 검증 — DB 조회 없음 (고빈도 write API용) */
export function requireGroupToken(
  request: Request,
  groupId: string,
  options?: { fallbackToken?: string | null }
): TokenAuthResult {
  const token = resolveGroupSessionToken(
    request,
    groupId,
    options?.fallbackToken
  );
  if (!token) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const payload = verifyGroupSessionToken(token, groupId);
  if (!payload) {
    return { ok: false, status: 401, error: "Invalid session" };
  }

  return { ok: true, payload };
}

export async function requireGroupSession(
  request: Request,
  groupId: string,
  repo: GroupRepository,
  options?: { fallbackToken?: string | null }
): Promise<AuthResult> {
  const token = resolveGroupSessionToken(
    request,
    groupId,
    options?.fallbackToken
  );
  if (!token) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const payload = verifyGroupSessionToken(token, groupId);
  if (!payload) {
    return { ok: false, status: 401, error: "Invalid session" };
  }

  const state = await repo.getGroupState(groupId);
  if (!state) {
    return { ok: false, status: 404, error: "Not found" };
  }

  const participant = state.participants.find(
    (p) => p.clientId === payload.clientId
  );
  if (!participant) {
    return { ok: false, status: 403, error: "Not a participant" };
  }

  return { ok: true, payload, state };
}

export async function requireHostSession(
  request: Request,
  groupId: string,
  repo: GroupRepository
): Promise<AuthResult> {
  const auth = await requireGroupSession(request, groupId, repo);
  if (!auth.ok) return auth;

  if (auth.state.group.hostClientId !== auth.payload.clientId) {
    return { ok: false, status: 403, error: "Host only" };
  }

  return auth;
}
