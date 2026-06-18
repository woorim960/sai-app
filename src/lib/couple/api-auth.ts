import { getCoupleRepository } from "./index";
import { isMemberAuthorized } from "./helpers";
import type { CoupleState } from "./types";

export function getCoupleAuth(request: Request): {
  clientId: string | null;
  token: string | null;
} {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const clientId = request.headers.get("x-client-id");
  return { clientId, token };
}

export type CoupleAuthResult =
  | { ok: true; state: CoupleState; clientId: string }
  | { ok: false; status: number };

export async function requireCoupleMember(
  request: Request,
  coupleId: string
): Promise<CoupleAuthResult> {
  const state = await getCoupleRepository().getCoupleState(coupleId);
  if (!state) return { ok: false, status: 404 };

  const { clientId, token } = getCoupleAuth(request);
  if (!clientId || !token || !isMemberAuthorized(state, clientId, token)) {
    return { ok: false, status: 401 };
  }

  return { ok: true, state, clientId };
}
