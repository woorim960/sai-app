import type { GroupState } from "./types";

function participantSignature(state: GroupState): string {
  return state.participants
    .map((p) => `${p.clientId}:${p.status}:${p.progressIndex}`)
    .join("|");
}

function answerSignature(state: GroupState): string {
  return state.answers
    .map(
      (a) =>
        `${a.clientId}:${a.cardId}:${a.selectedOption ?? ""}:${a.selectedLabel ?? ""}:${a.answerText ?? ""}`
    )
    .join("|");
}

export function isSameGroupState(a: GroupState, b: GroupState): boolean {
  const ga = a.group;
  const gb = b.group;

  return (
    ga.status === gb.status &&
    ga.currentCardIndex === gb.currentCardIndex &&
    ga.mode === gb.mode &&
    participantSignature(a) === participantSignature(b) &&
    answerSignature(a) === answerSignature(b)
  );
}
