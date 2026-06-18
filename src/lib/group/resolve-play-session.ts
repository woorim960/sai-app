import { getClientId, setClientId } from "@/lib/client-id";
import { getClientIdFromSessionToken } from "@/lib/group/session-client";
import { getGroupSessionToken } from "@/lib/group/session-storage";

/** 플레이 시작 직후 모바일에서 localStorage·쿠키·세션 토큰 불일치를 복구 */
export function resolvePlayClientId(groupId: string): string {
  const token = getGroupSessionToken(groupId);
  const tokenClientId = token ? getClientIdFromSessionToken(token) : null;

  if (tokenClientId) {
    setClientId(tokenClientId);
    return tokenClientId;
  }

  return getClientId();
}
