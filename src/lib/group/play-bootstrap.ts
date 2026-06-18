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
