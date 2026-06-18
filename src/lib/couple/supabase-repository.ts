import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  generateCoupleId,
  generateInviteCode,
  generateMemberToken,
} from "./id";
import { DEFAULT_MEMBER_EMOJI, DEFAULT_PARTNER_EMOJI } from "./helpers";
import type { CoupleRepository } from "./repository-types";
import type {
  Couple,
  CoupleMember,
  CoupleRecord,
  CoupleState,
} from "./types";

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

export function isSupabaseCoupleStoreConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  );
}

type CoupleRow = {
  id: string;
  invite_code: string;
  couple_name: string | null;
  anniversary: string | null;
  created_at: string;
};

type MemberRow = {
  client_id: string;
  display_name: string;
  emoji: string;
  token: string;
  joined_at: string;
};

type RecordRow = {
  id: string;
  deck_id: string;
  deck_title: string;
  mode: string;
  minutes: number;
  score: number | null;
  note: string | null;
  by_client_id: string;
  completed_at: string;
};

function mapCouple(row: CoupleRow): Couple {
  return {
    id: row.id,
    inviteCode: row.invite_code,
    coupleName: row.couple_name ?? undefined,
    anniversary: row.anniversary ?? undefined,
    createdAt: row.created_at,
  };
}

function mapMember(row: MemberRow): CoupleMember {
  return {
    clientId: row.client_id,
    displayName: row.display_name,
    emoji: row.emoji,
    token: row.token,
    joinedAt: row.joined_at,
  };
}

function mapRecord(row: RecordRow): CoupleRecord {
  return {
    id: row.id,
    deckId: row.deck_id,
    deckTitle: row.deck_title,
    mode: row.mode as CoupleRecord["mode"],
    minutes: row.minutes,
    score: row.score ?? undefined,
    note: row.note ?? undefined,
    byClientId: row.by_client_id,
    completedAt: row.completed_at,
  };
}

async function loadCoupleState(
  client: SupabaseClient,
  coupleId: string
): Promise<CoupleState | null> {
  const { data: coupleRow, error } = await client
    .from("couples")
    .select("*")
    .eq("id", coupleId)
    .maybeSingle();

  if (error || !coupleRow) return null;

  const { data: members } = await client
    .from("couple_members")
    .select("*")
    .eq("couple_id", coupleId)
    .order("joined_at", { ascending: true });

  const { data: records } = await client
    .from("couple_records")
    .select("*")
    .eq("couple_id", coupleId)
    .order("completed_at", { ascending: false })
    .limit(200);

  return {
    couple: mapCouple(coupleRow as CoupleRow),
    members: ((members ?? []) as MemberRow[]).map(mapMember),
    records: ((records ?? []) as RecordRow[]).map(mapRecord),
  };
}

async function uniqueCoupleId(client: SupabaseClient): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = generateCoupleId();
    const { data } = await client
      .from("couples")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (!data) return id;
  }
  return generateCoupleId(16);
}

async function uniqueInviteCode(client: SupabaseClient): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateInviteCode();
    const { data } = await client
      .from("couples")
      .select("id")
      .eq("invite_code", code)
      .maybeSingle();
    if (!data) return code;
  }
  return generateInviteCode(8);
}

export const supabaseCoupleRepository: CoupleRepository = {
  async createCouple(input) {
    const client = getServiceClient();
    if (!client) throw new Error("Supabase not configured");

    const id = await uniqueCoupleId(client);
    const inviteCode = await uniqueInviteCode(client);
    const now = new Date().toISOString();
    const token = generateMemberToken();

    const { error: coupleError } = await client.from("couples").insert({
      id,
      invite_code: inviteCode,
      couple_name: input.coupleName ?? null,
      anniversary: input.anniversary ?? null,
      created_at: now,
    });
    if (coupleError) throw coupleError;

    const { error: memberError } = await client.from("couple_members").insert({
      couple_id: id,
      client_id: input.clientId,
      display_name: input.displayName,
      emoji: input.emoji ?? DEFAULT_MEMBER_EMOJI,
      token,
      joined_at: now,
    });
    if (memberError) throw memberError;

    const state = await loadCoupleState(client, id);
    if (!state) throw new Error("Failed to load created couple");
    return { state, token };
  },

  async joinCouple(input) {
    const client = getServiceClient();
    if (!client) return { ok: false, reason: "not_found" };

    const { data: coupleRow } = await client
      .from("couples")
      .select("id")
      .eq("invite_code", input.inviteCode.toUpperCase())
      .maybeSingle();

    if (!coupleRow) return { ok: false, reason: "not_found" };
    const coupleId = (coupleRow as { id: string }).id;

    const state = await loadCoupleState(client, coupleId);
    if (!state) return { ok: false, reason: "not_found" };

    const existing = state.members.find(
      (member) => member.clientId === input.clientId
    );
    if (existing) return { ok: true, state, token: existing.token };

    if (state.members.length >= 2) return { ok: false, reason: "full" };

    const token = generateMemberToken();
    const { error } = await client.from("couple_members").insert({
      couple_id: coupleId,
      client_id: input.clientId,
      display_name: input.displayName,
      emoji: input.emoji ?? DEFAULT_PARTNER_EMOJI,
      token,
      joined_at: new Date().toISOString(),
    });
    if (error) return { ok: false, reason: "not_found" };

    const next = await loadCoupleState(client, coupleId);
    if (!next) return { ok: false, reason: "not_found" };
    return { ok: true, state: next, token };
  },

  async getCoupleState(coupleId) {
    const client = getServiceClient();
    if (!client) return null;
    return loadCoupleState(client, coupleId);
  },

  async addCoupleRecord(input) {
    const client = getServiceClient();
    if (!client) return null;

    const state = await loadCoupleState(client, input.coupleId);
    if (!state) return null;
    if (!state.members.some((member) => member.clientId === input.clientId)) {
      return null;
    }

    await client
      .from("couple_records")
      .delete()
      .eq("couple_id", input.coupleId)
      .eq("deck_id", input.deckId)
      .eq("mode", input.mode)
      .eq("by_client_id", input.clientId);

    const { error } = await client.from("couple_records").insert({
      id: generateMemberToken(10),
      couple_id: input.coupleId,
      deck_id: input.deckId,
      deck_title: input.deckTitle,
      mode: input.mode,
      minutes: input.minutes,
      score: input.score ?? null,
      note: input.note ?? null,
      by_client_id: input.clientId,
      completed_at: new Date().toISOString(),
    });
    if (error) return null;

    return loadCoupleState(client, input.coupleId);
  },

  async updateCoupleProfile(coupleId, patch) {
    const client = getServiceClient();
    if (!client) return null;

    const update: Record<string, string | null> = {};
    if (patch.coupleName !== undefined)
      update.couple_name = patch.coupleName || null;
    if (patch.anniversary !== undefined)
      update.anniversary = patch.anniversary || null;

    if (Object.keys(update).length > 0) {
      const { error } = await client
        .from("couples")
        .update(update)
        .eq("id", coupleId);
      if (error) return null;
    }

    return loadCoupleState(client, coupleId);
  },
};
