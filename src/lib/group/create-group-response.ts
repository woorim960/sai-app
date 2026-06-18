import type { GroupMode } from "./types";

/** POST /api/groups — 플레이 시작에 필요한 최소 필드만 */
export type CreateGroupResponse = {
  groupId: string;
  deckId: string;
  mode: GroupMode;
  sessionToken: string;
};
