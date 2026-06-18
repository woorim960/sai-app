import type { GroupMode, GroupState } from "./types";

/** POST /api/groups — 플레이 시작에 필요한 필드 */
export type CreateGroupResponse = {
  groupId: string;
  deckId: string;
  mode: GroupMode;
  sessionToken: string;
  initialState: GroupState;
};
