import { verifyGroupSessionToken } from "@/lib/group/session";
import type { GroupState } from "@/lib/group/types";

export type PlayBootstrap = {
  clientId: string;
  sessionToken: string;
  sessionReady: boolean;
  initialProgressIndex: number;
  completed: boolean;
};

export function resolvePlayBootstrap(
  groupId: string,
  state: GroupState,
  cardCount: number,
  input: {
    clientId?: string | null;
    sessionToken?: string | null;
  }
): PlayBootstrap | null {
  const clientId = input.clientId?.trim();
  const sessionToken = input.sessionToken?.trim();

  if (!clientId || !sessionToken) return null;

  const payload = verifyGroupSessionToken(sessionToken, groupId);
  if (!payload || payload.clientId !== clientId) return null;

  const me = state.participants.find(
    (participant) => participant.clientId === clientId
  );
  if (!me) return null;

  const maxIndex = Math.max(cardCount - 1, 0);

  return {
    clientId,
    sessionToken,
    sessionReady: true,
    initialProgressIndex:
      me.progressIndex > 0 ? Math.min(me.progressIndex, maxIndex) : 0,
    completed: me.status === "completed",
  };
}

/** handoff/직접 생성 세션 — 클라이언트에서 crypto 없이 bootstrap 구성 */
export function buildTrustedPlayBootstrap(
  state: GroupState,
  cardCount: number,
  clientId: string,
  sessionToken: string
): PlayBootstrap | null {
  const trimmedId = clientId.trim();
  const trimmedToken = sessionToken.trim();
  if (!trimmedId || !trimmedToken) return null;

  const me = state.participants.find(
    (participant) => participant.clientId === trimmedId
  );
  if (!me) return null;

  const maxIndex = Math.max(cardCount - 1, 0);

  return {
    clientId: trimmedId,
    sessionToken: trimmedToken,
    sessionReady: true,
    initialProgressIndex:
      me.progressIndex > 0 ? Math.min(me.progressIndex, maxIndex) : 0,
    completed: me.status === "completed",
  };
}
