import type { GroupPublicPreview, GroupState } from "./types";

export function toGroupPublicPreview(state: GroupState): GroupPublicPreview {
  return {
    group: {
      id: state.group.id,
      deckId: state.group.deckId,
      mode: state.group.mode,
      status: state.group.status,
      expiresAt: state.group.expiresAt,
    },
    participants: state.participants.map((p) => ({
      displayName: p.displayName,
      status: p.status,
    })),
    participantCount: state.participants.length,
  };
}

export function isFullGroupState(
  data: GroupState | GroupPublicPreview
): data is GroupState {
  return "answers" in data && Array.isArray(data.answers);
}
