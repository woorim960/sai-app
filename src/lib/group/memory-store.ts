import { generateGroupId } from "./id";
import type { GroupRepository } from "./repository-types";
import { computeGroupExpiresAt, isGroupExpired } from "./ttl";
import type {
  AdvanceAsyncParticipantInput,
  AdvanceAsyncParticipantResult,
  CreateGroupInput,
  Group,
  GroupAnswer,
  GroupParticipant,
  GroupResolveResult,
  GroupState,
  JoinGroupInput,
  SaveAnswerInput,
} from "./types";

type StoreData = Map<string, GroupState>;

declare global {
  // eslint-disable-next-line no-var
  var __saiGroupStore: StoreData | undefined;
}

function getStore(): StoreData {
  if (!globalThis.__saiGroupStore) {
    globalThis.__saiGroupStore = new Map();
  }
  return globalThis.__saiGroupStore;
}

function purgeExpiredGroups(): void {
  const store = getStore();
  const now = Date.now();

  for (const [id, state] of store) {
    if (new Date(state.group.expiresAt).getTime() <= now) {
      store.delete(id);
    }
  }
}

function getRawGroupState(groupId: string): GroupState | null {
  purgeExpiredGroups();
  return getStore().get(groupId) ?? null;
}

function resolveGroupSync(groupId: string): GroupResolveResult {
  const state = getRawGroupState(groupId);
  if (!state) return { status: "missing" };
  if (isGroupExpired(state.group)) {
    getStore().delete(groupId);
    return {
      status: "expired",
      expiredAt: state.group.expiresAt,
      deckId: state.group.deckId,
    };
  }
  return { status: "active", state };
}

function getActiveGroupState(groupId: string): GroupState | null {
  const result = resolveGroupSync(groupId);
  return result.status === "active" ? result.state : null;
}

function getParticipant(
  state: GroupState,
  clientId: string
): GroupParticipant | undefined {
  return state.participants.find((p) => p.clientId === clientId);
}

function createGroupState(input: CreateGroupInput): GroupState {
  const store = getStore();
  let id = generateGroupId();

  while (store.has(id)) {
    id = generateGroupId();
  }

  const now = new Date().toISOString();
  const group: Group = {
    id,
    deckId: input.deckId,
    mode: input.mode,
    hostClientId: input.hostClientId,
    status: input.mode === "async" ? "playing" : "waiting",
    currentCardIndex: 0,
    createdAt: now,
    expiresAt: computeGroupExpiresAt(now),
    startedAt: input.mode === "async" ? now : undefined,
  };

  const host: GroupParticipant = {
    clientId: input.hostClientId,
    displayName: input.hostDisplayName,
    status: "playing",
    progressIndex: 0,
    joinedAt: now,
  };

  const state: GroupState = { group, participants: [host], answers: [] };
  store.set(id, state);
  return state;
}

function joinGroupSync(input: JoinGroupInput): GroupState | null {
  const state = getActiveGroupState(input.groupId);
  if (!state) return null;

  if (state.group.status === "finished") return null;

  if (state.group.mode === "sync" && state.group.status !== "waiting") {
    return null;
  }

  const existing = getParticipant(state, input.clientId);
  if (existing) return state;

  state.participants.push({
    clientId: input.clientId,
    displayName: input.displayName,
    status: "playing",
    progressIndex: 0,
    joinedAt: new Date().toISOString(),
  });

  return state;
}

function startSyncGroupSync(
  groupId: string,
  clientId: string
): GroupState | null {
  const state = getActiveGroupState(groupId);
  if (!state) return null;
  if (state.group.mode !== "sync") return null;
  if (state.group.hostClientId !== clientId) return null;
  if (state.group.status !== "waiting") return state;
  if (state.participants.length < 2) return null;

  state.group.status = "playing";
  state.group.startedAt = new Date().toISOString();
  state.group.currentCardIndex = 0;
  return state;
}

function saveGroupAnswerSync(input: SaveAnswerInput): GroupState | null {
  const state = getActiveGroupState(input.groupId);
  if (!state) return null;

  const participant = getParticipant(state, input.clientId);
  if (!participant || participant.status === "completed") return null;

  const answer: GroupAnswer = {
    clientId: input.clientId,
    cardId: input.cardId,
    cardType: input.cardType,
    selectedOption: input.selectedOption,
    selectedLabel: input.selectedLabel,
    answerText: input.answerText,
    answeredAt: new Date().toISOString(),
  };

  state.answers = state.answers.filter(
    (a) => !(a.clientId === input.clientId && a.cardId === input.cardId)
  );
  state.answers.push(answer);
  return state;
}

function updateParticipantProgressSync(
  groupId: string,
  clientId: string,
  progressIndex: number
): GroupState | null {
  const state = getActiveGroupState(groupId);
  if (!state) return null;

  const participant = getParticipant(state, clientId);
  if (!participant || participant.status === "completed") return null;

  participant.progressIndex = progressIndex;
  return state;
}

function completeParticipantSync(
  groupId: string,
  clientId: string
): GroupState | null {
  const state = getActiveGroupState(groupId);
  if (!state) return null;

  const participant = getParticipant(state, clientId);
  if (!participant) return null;

  participant.status = "completed";
  participant.completedAt = new Date().toISOString();
  return state;
}

function advanceAsyncParticipantSync(
  input: AdvanceAsyncParticipantInput
): AdvanceAsyncParticipantResult {
  const saved = saveGroupAnswerSync({
    groupId: input.groupId,
    clientId: input.clientId,
    cardId: input.cardId,
    cardType: input.cardType,
    selectedOption: input.selectedOption,
    selectedLabel: input.selectedLabel,
  });

  if (!saved) return { ok: false };

  const isLast = input.cardIndex >= input.totalCards - 1;
  if (isLast) {
    return completeParticipantSync(input.groupId, input.clientId)
      ? { ok: true, kind: "complete" }
      : { ok: false };
  }

  const nextIndex = input.cardIndex + 1;
  const progressed = updateParticipantProgressSync(
    input.groupId,
    input.clientId,
    nextIndex
  );

  return progressed ? { ok: true, kind: "next", nextIndex } : { ok: false };
}

function advanceSyncCardSync(
  groupId: string,
  clientId: string,
  maxCardIndex: number
): GroupState | null {
  const state = getActiveGroupState(groupId);
  if (!state) return null;
  if (state.group.mode !== "sync") return null;
  if (state.group.hostClientId !== clientId) return null;
  if (state.group.status !== "playing") return null;

  if (state.group.currentCardIndex >= maxCardIndex) return state;

  state.group.currentCardIndex += 1;
  return state;
}

function finishSyncGroupSync(
  groupId: string,
  clientId: string
): GroupState | null {
  const state = getActiveGroupState(groupId);
  if (!state) return null;
  if (state.group.hostClientId !== clientId) return null;

  state.group.status = "finished";
  state.group.finishedAt = new Date().toISOString();

  for (const participant of state.participants) {
    if (participant.status === "playing") {
      participant.status = "completed";
      participant.completedAt = new Date().toISOString();
    }
  }

  return state;
}

export const memoryGroupRepository: GroupRepository = {
  createGroup: async (input) => createGroupState(input),
  resolveGroup: async (groupId) => resolveGroupSync(groupId),
  getGroupState: async (groupId) => getActiveGroupState(groupId),
  joinGroup: async (input) => joinGroupSync(input),
  startSyncGroup: async (groupId, clientId) =>
    startSyncGroupSync(groupId, clientId),
  saveGroupAnswer: async (input) => saveGroupAnswerSync(input),
  advanceAsyncParticipant: async (input) => advanceAsyncParticipantSync(input),
  updateParticipantProgress: async (groupId, clientId, progressIndex) =>
    updateParticipantProgressSync(groupId, clientId, progressIndex),
  completeParticipant: async (groupId, clientId) =>
    completeParticipantSync(groupId, clientId),
  advanceSyncCard: async (groupId, clientId, maxCardIndex) =>
    advanceSyncCardSync(groupId, clientId, maxCardIndex),
  finishSyncGroup: async (groupId, clientId) =>
    finishSyncGroupSync(groupId, clientId),
};

/** @deprecated Use getGroupRepository().getGroupState() */
export function getGroupState(groupId: string): GroupState | null {
  return getActiveGroupState(groupId);
}

/** @deprecated Use getGroupRepository().createGroup() */
export function createGroup(input: CreateGroupInput): GroupState {
  return createGroupState(input);
}

/** @deprecated Use getGroupRepository().joinGroup() */
export function joinGroup(input: JoinGroupInput): GroupState | null {
  return joinGroupSync(input);
}

/** @deprecated Use getGroupRepository() */
export {
  startSyncGroupSync as startSyncGroup,
  saveGroupAnswerSync as saveGroupAnswer,
  updateParticipantProgressSync as updateParticipantProgress,
  completeParticipantSync as completeParticipant,
  advanceSyncCardSync as advanceSyncCard,
  finishSyncGroupSync as finishSyncGroup,
};
