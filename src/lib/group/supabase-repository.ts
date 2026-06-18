import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { GroupRepository } from "./repository-types";
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
import { generateGroupId } from "./id";
import { computeGroupExpiresAt, isGroupExpired } from "./ttl";

let serviceClient: SupabaseClient | null = null;

function getServiceClient(): SupabaseClient | null {
  if (serviceClient) return serviceClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  serviceClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceClient;
}

export function isSupabaseGroupStoreConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

type GroupRow = {
  id: string;
  deck_id: string;
  mode: "async" | "sync";
  host_client_id: string;
  status: "waiting" | "playing" | "finished";
  current_card_index: number;
  created_at: string;
  expires_at: string;
  started_at: string | null;
  finished_at: string | null;
};

type ParticipantRow = {
  client_id: string;
  display_name: string;
  status: "playing" | "completed";
  progress_index: number;
  joined_at: string;
  completed_at: string | null;
};

type AnswerRow = {
  client_id: string;
  card_id: string;
  card_type: "balance" | "question";
  selected_option: string | null;
  selected_label: string | null;
  answer_text: string | null;
  answered_at: string;
};

function mapGroup(row: GroupRow): Group {
  return {
    id: row.id,
    deckId: row.deck_id,
    mode: row.mode,
    hostClientId: row.host_client_id,
    status: row.status,
    currentCardIndex: row.current_card_index,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    startedAt: row.started_at ?? undefined,
    finishedAt: row.finished_at ?? undefined,
  };
}

function mapParticipant(row: ParticipantRow): GroupParticipant {
  return {
    clientId: row.client_id,
    displayName: row.display_name,
    status: row.status,
    progressIndex: row.progress_index,
    joinedAt: row.joined_at,
    completedAt: row.completed_at ?? undefined,
  };
}

function mapAnswer(row: AnswerRow): GroupAnswer {
  return {
    clientId: row.client_id,
    cardId: row.card_id,
    cardType: row.card_type,
    selectedOption: (row.selected_option as "A" | "B" | null) ?? undefined,
    selectedLabel: row.selected_label ?? undefined,
    answerText: row.answer_text ?? undefined,
    answeredAt: row.answered_at,
  };
}

async function deleteGroup(client: SupabaseClient, groupId: string): Promise<void> {
  await client.from("play_groups").delete().eq("id", groupId);
}

async function loadRawGroupState(
  client: SupabaseClient,
  groupId: string
): Promise<GroupState | null> {
  const [
    { data: groupRow, error: groupError },
    { data: participants, error: participantsError },
    { data: answers, error: answersError },
  ] = await Promise.all([
    client.from("play_groups").select("*").eq("id", groupId).maybeSingle(),
    client.from("play_group_participants").select("*").eq("group_id", groupId),
    client.from("play_group_answers").select("*").eq("group_id", groupId),
  ]);

  if (groupError || !groupRow || participantsError || answersError) {
    return null;
  }

  return {
    group: mapGroup(groupRow as GroupRow),
    participants: (participants as ParticipantRow[]).map(mapParticipant),
    answers: (answers as AnswerRow[]).map(mapAnswer),
  };
}

async function resolveGroupState(
  client: SupabaseClient,
  groupId: string
): Promise<GroupResolveResult> {
  const state = await loadRawGroupState(client, groupId);
  if (!state) return { status: "missing" };

  if (isGroupExpired(state.group)) {
    const deckId = state.group.deckId;
    await deleteGroup(client, groupId);
    return { status: "expired", expiredAt: state.group.expiresAt, deckId };
  }

  return { status: "active", state };
}

async function loadActiveGroupState(
  client: SupabaseClient,
  groupId: string
): Promise<GroupState | null> {
  const result = await resolveGroupState(client, groupId);
  return result.status === "active" ? result.state : null;
}

function createUniqueGroupId(): string {
  return generateGroupId(12);
}

function buildCreatedGroupState(
  id: string,
  input: CreateGroupInput,
  now: string,
  expiresAt: string
): GroupState {
  const isAsync = input.mode === "async";
  const group: Group = {
    id,
    deckId: input.deckId,
    mode: input.mode,
    hostClientId: input.hostClientId,
    status: isAsync ? "playing" : "waiting",
    currentCardIndex: 0,
    createdAt: now,
    expiresAt,
    startedAt: isAsync ? now : undefined,
  };

  const host: GroupParticipant = {
    clientId: input.hostClientId,
    displayName: input.hostDisplayName,
    status: "playing",
    progressIndex: 0,
    joinedAt: now,
  };

  return { group, participants: [host], answers: [] };
}

export const supabaseGroupRepository: GroupRepository = {
  async createGroup(input) {
    const client = getServiceClient();
    if (!client) throw new Error("Supabase not configured");

    const id = createUniqueGroupId();
    const now = new Date().toISOString();
    const isAsync = input.mode === "async";
    const expiresAt = computeGroupExpiresAt(now);

    const { error: groupError } = await client.from("play_groups").insert({
      id,
      deck_id: input.deckId,
      mode: input.mode,
      host_client_id: input.hostClientId,
      status: isAsync ? "playing" : "waiting",
      current_card_index: 0,
      created_at: now,
      expires_at: expiresAt,
      started_at: isAsync ? now : null,
    });

    if (groupError) throw groupError;

    const { error: participantError } = await client
      .from("play_group_participants")
      .insert({
        group_id: id,
        client_id: input.hostClientId,
        display_name: input.hostDisplayName,
        status: "playing",
        progress_index: 0,
        joined_at: now,
      });

    if (participantError) throw participantError;

    return buildCreatedGroupState(id, input, now, expiresAt);
  },

  async resolveGroup(groupId) {
    const client = getServiceClient();
    if (!client) return { status: "missing" };
    return resolveGroupState(client, groupId);
  },

  async getGroupState(groupId) {
    const client = getServiceClient();
    if (!client) return null;
    return loadActiveGroupState(client, groupId);
  },

  async joinGroup(input) {
    const client = getServiceClient();
    if (!client) return null;

    const state = await loadActiveGroupState(client, input.groupId);
    if (!state) return null;

    if (state.group.status === "finished") return null;
    if (state.group.mode === "sync" && state.group.status !== "waiting") {
      return null;
    }

    const existing = state.participants.find(
      (p) => p.clientId === input.clientId
    );
    if (existing) return state;

    const { error } = await client.from("play_group_participants").insert({
      group_id: input.groupId,
      client_id: input.clientId,
      display_name: input.displayName,
      status: "playing",
      progress_index: 0,
      joined_at: new Date().toISOString(),
    });

    if (error) return null;
    return loadActiveGroupState(client, input.groupId);
  },

  async startSyncGroup(groupId, clientId) {
    const client = getServiceClient();
    if (!client) return null;

    const state = await loadActiveGroupState(client, groupId);
    if (!state) return null;
    if (state.group.mode !== "sync") return null;
    if (state.group.hostClientId !== clientId) return null;
    if (state.group.status !== "waiting") return state;
    if (state.participants.length < 2) return null;

    const now = new Date().toISOString();
    await client
      .from("play_groups")
      .update({ status: "playing", started_at: now, current_card_index: 0 })
      .eq("id", groupId);

    return loadActiveGroupState(client, groupId);
  },

  async saveGroupAnswer(input) {
    const client = getServiceClient();
    if (!client) return null;

    const { error } = await client.from("play_group_answers").upsert(
      {
        group_id: input.groupId,
        client_id: input.clientId,
        card_id: input.cardId,
        card_type: input.cardType,
        selected_option: input.selectedOption ?? null,
        selected_label: input.selectedLabel ?? null,
        answer_text: input.answerText ?? null,
        answered_at: new Date().toISOString(),
      },
      { onConflict: "group_id,client_id,card_id" }
    );

    if (error) return null;
    return loadActiveGroupState(client, input.groupId);
  },

  async advanceAsyncParticipant(
    input: AdvanceAsyncParticipantInput
  ): Promise<AdvanceAsyncParticipantResult> {
    const client = getServiceClient();
    if (!client) return { ok: false };

    const now = new Date().toISOString();
    const isLast = input.cardIndex >= input.totalCards - 1;

    const answerWrite = client.from("play_group_answers").upsert(
      {
        group_id: input.groupId,
        client_id: input.clientId,
        card_id: input.cardId,
        card_type: input.cardType,
        selected_option: input.selectedOption ?? null,
        selected_label: input.selectedLabel ?? null,
        answer_text: null,
        answered_at: now,
      },
      { onConflict: "group_id,client_id,card_id" }
    );

    if (isLast) {
      const [answerResult, completeResult] = await Promise.all([
        answerWrite,
        client
          .from("play_group_participants")
          .update({ status: "completed", completed_at: now })
          .eq("group_id", input.groupId)
          .eq("client_id", input.clientId)
          .eq("status", "playing"),
      ]);

      if (answerResult.error || completeResult.error) {
        return { ok: false };
      }

      return { ok: true, kind: "complete" };
    }

    const nextIndex = input.cardIndex + 1;
    const [answerResult, progressResult] = await Promise.all([
      answerWrite,
      client
        .from("play_group_participants")
        .update({ progress_index: nextIndex })
        .eq("group_id", input.groupId)
        .eq("client_id", input.clientId)
        .eq("status", "playing"),
    ]);

    if (answerResult.error || progressResult.error) {
      return { ok: false };
    }

    return { ok: true, kind: "next", nextIndex };
  },

  async updateParticipantProgress(groupId, clientId, progressIndex) {
    const client = getServiceClient();
    if (!client) return null;

    const { error } = await client
      .from("play_group_participants")
      .update({ progress_index: progressIndex })
      .eq("group_id", groupId)
      .eq("client_id", clientId)
      .eq("status", "playing");

    if (error) return null;
    return loadActiveGroupState(client, groupId);
  },

  async completeParticipant(groupId, clientId) {
    const client = getServiceClient();
    if (!client) return null;

    const now = new Date().toISOString();
    const { error } = await client
      .from("play_group_participants")
      .update({ status: "completed", completed_at: now })
      .eq("group_id", groupId)
      .eq("client_id", clientId)
      .eq("status", "playing");

    if (error) return null;
    return loadActiveGroupState(client, groupId);
  },

  async advanceSyncCard(groupId, clientId, maxCardIndex) {
    const client = getServiceClient();
    if (!client) return null;

    const state = await loadActiveGroupState(client, groupId);
    if (!state) return null;
    if (state.group.mode !== "sync") return null;
    if (state.group.hostClientId !== clientId) return null;
    if (state.group.status !== "playing") return null;
    if (state.group.currentCardIndex >= maxCardIndex) return state;

    await client
      .from("play_groups")
      .update({ current_card_index: state.group.currentCardIndex + 1 })
      .eq("id", groupId);

    return loadActiveGroupState(client, groupId);
  },

  async finishSyncGroup(groupId, clientId) {
    const client = getServiceClient();
    if (!client) return null;

    const state = await loadActiveGroupState(client, groupId);
    if (!state) return null;
    if (state.group.hostClientId !== clientId) return null;

    const now = new Date().toISOString();
    await client
      .from("play_groups")
      .update({ status: "finished", finished_at: now })
      .eq("id", groupId);

    await client
      .from("play_group_participants")
      .update({ status: "completed", completed_at: now })
      .eq("group_id", groupId)
      .eq("status", "playing");

    return loadActiveGroupState(client, groupId);
  },
};
