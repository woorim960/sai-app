import type { GroupState } from "@/lib/group/types";
import {
  getGroupSessionToken,
  saveGroupSessionToken,
} from "@/lib/group/session-storage";
import { isFullGroupState } from "@/lib/group/public-preview";

export type PollGroupStateResult =
  | { status: "ok"; state: GroupState }
  | { status: "missing" }
  | { status: "expired" }
  | { status: "preview" }
  | { status: "error" };

function authHeaders(groupId: string): HeadersInit {
  const token = getGroupSessionToken(groupId);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** 폴링 전용 — 절대 throw하지 않음 */
export async function pollGroupState(
  groupId: string
): Promise<PollGroupStateResult> {
  try {
    const res = await fetch(`/api/groups/${groupId}`, {
      cache: "no-store",
      headers: authHeaders(groupId),
    });

    if (res.status === 404) return { status: "missing" };
    if (res.status === 410) return { status: "expired" };
    if (!res.ok) return { status: "error" };

    const data = await res.json();
    if (!isFullGroupState(data)) return { status: "preview" };

    if ("sessionToken" in data && typeof data.sessionToken === "string") {
      saveGroupSessionToken(groupId, data.sessionToken);
    }

    return { status: "ok", state: data as GroupState };
  } catch {
    return { status: "error" };
  }
}
