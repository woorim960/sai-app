import { getGroupRepository } from "@/lib/group/index";
import type { GroupResolveResult, GroupState } from "@/lib/group/types";

export async function resolveGroup(
  groupId: string
): Promise<GroupResolveResult> {
  return getGroupRepository().resolveGroup(groupId);
}

export async function loadGroupState(
  groupId: string
): Promise<GroupState | null> {
  const result = await resolveGroup(groupId);
  return result.status === "active" ? result.state : null;
}

export type ActiveGroupLoadResult =
  | { kind: "ok"; state: GroupState }
  | { kind: "expired"; deckId?: string }
  | { kind: "missing" };

export async function loadActiveGroup(
  groupId: string
): Promise<ActiveGroupLoadResult> {
  const result = await resolveGroup(groupId);
  switch (result.status) {
    case "active":
      return { kind: "ok", state: result.state };
    case "expired":
      return { kind: "expired", deckId: result.deckId };
    case "missing":
      return { kind: "missing" };
  }
}
