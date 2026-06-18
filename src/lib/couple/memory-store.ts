import {
  generateCoupleId,
  generateInviteCode,
  generateMemberToken,
} from "./id";
import {
  DEFAULT_MEMBER_EMOJI,
  DEFAULT_PARTNER_EMOJI,
  findMember,
} from "./helpers";
import type { CoupleRepository } from "./repository-types";
import type {
  AddCoupleRecordInput,
  Couple,
  CoupleMember,
  CoupleProfilePatch,
  CoupleRecord,
  CoupleState,
  CreateCoupleInput,
  JoinCoupleInput,
  JoinCoupleResult,
} from "./types";

type StoreData = {
  byId: Map<string, CoupleState>;
  byInvite: Map<string, string>;
};

declare global {
  // eslint-disable-next-line no-var
  var __saiCoupleStore: StoreData | undefined;
}

function getStore(): StoreData {
  if (!globalThis.__saiCoupleStore) {
    globalThis.__saiCoupleStore = {
      byId: new Map(),
      byInvite: new Map(),
    };
  }
  return globalThis.__saiCoupleStore;
}

function createCoupleSync(input: CreateCoupleInput): {
  state: CoupleState;
  token: string;
} {
  const store = getStore();

  let id = generateCoupleId();
  while (store.byId.has(id)) id = generateCoupleId();

  let inviteCode = generateInviteCode();
  while (store.byInvite.has(inviteCode)) inviteCode = generateInviteCode();

  const now = new Date().toISOString();
  const token = generateMemberToken();

  const couple: Couple = {
    id,
    inviteCode,
    coupleName: input.coupleName,
    anniversary: input.anniversary,
    createdAt: now,
  };

  const member: CoupleMember = {
    clientId: input.clientId,
    displayName: input.displayName,
    emoji: input.emoji ?? DEFAULT_MEMBER_EMOJI,
    joinedAt: now,
    token,
  };

  const state: CoupleState = { couple, members: [member], records: [] };
  store.byId.set(id, state);
  store.byInvite.set(inviteCode, id);

  return { state, token };
}

function joinCoupleSync(input: JoinCoupleInput): JoinCoupleResult {
  const store = getStore();
  const coupleId = store.byInvite.get(input.inviteCode.toUpperCase());
  if (!coupleId) return { ok: false, reason: "not_found" };

  const state = store.byId.get(coupleId);
  if (!state) return { ok: false, reason: "not_found" };

  const existing = findMember(state, input.clientId);
  if (existing) return { ok: true, state, token: existing.token };

  if (state.members.length >= 2) return { ok: false, reason: "full" };

  const token = generateMemberToken();
  state.members.push({
    clientId: input.clientId,
    displayName: input.displayName,
    emoji: input.emoji ?? DEFAULT_PARTNER_EMOJI,
    joinedAt: new Date().toISOString(),
    token,
  });

  return { ok: true, state, token };
}

function addCoupleRecordSync(input: AddCoupleRecordInput): CoupleState | null {
  const state = getStore().byId.get(input.coupleId) ?? null;
  if (!state) return null;
  if (!findMember(state, input.clientId)) return null;

  const record: CoupleRecord = {
    id: generateMemberToken(10),
    deckId: input.deckId,
    deckTitle: input.deckTitle,
    mode: input.mode,
    minutes: input.minutes,
    score: input.score,
    note: input.note,
    byClientId: input.clientId,
    completedAt: new Date().toISOString(),
  };

  const existingIndex = state.records.findIndex(
    (item) =>
      item.deckId === input.deckId &&
      item.mode === input.mode &&
      item.byClientId === input.clientId
  );

  if (existingIndex >= 0) {
    state.records[existingIndex] = {
      ...record,
      id: state.records[existingIndex]!.id,
    };
  } else {
    state.records = [record, ...state.records].slice(0, 200);
  }

  return state;
}

function updateCoupleProfileSync(
  coupleId: string,
  patch: CoupleProfilePatch
): CoupleState | null {
  const state = getStore().byId.get(coupleId) ?? null;
  if (!state) return null;
  if (patch.coupleName !== undefined) state.couple.coupleName = patch.coupleName;
  if (patch.anniversary !== undefined)
    state.couple.anniversary = patch.anniversary;
  return state;
}

export const memoryCoupleRepository: CoupleRepository = {
  createCouple: async (input) => createCoupleSync(input),
  joinCouple: async (input) => joinCoupleSync(input),
  getCoupleState: async (coupleId) => getStore().byId.get(coupleId) ?? null,
  addCoupleRecord: async (input) => addCoupleRecordSync(input),
  updateCoupleProfile: async (coupleId, patch) =>
    updateCoupleProfileSync(coupleId, patch),
};
