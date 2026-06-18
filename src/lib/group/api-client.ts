import type { GroupMode, GroupState, GroupStateResponse } from "@/lib/group/types";
import {
  getGroupSessionToken,
  saveGroupSessionToken,
} from "@/lib/group/session-storage";
import { pollGroupState } from "@/lib/group/poll-group-state";

function authHeaders(groupId: string): HeadersInit {
  const token = getGroupSessionToken(groupId);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function jsonHeaders(groupId?: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(groupId ? authHeaders(groupId) : {}),
  };
}

function persistSession(groupId: string, data: GroupStateResponse): GroupState {
  if (data.sessionToken) {
    saveGroupSessionToken(groupId, data.sessionToken);
  }
  return data;
}

export async function createGroupRequest(input: {
  deckId: string;
  mode: GroupMode;
  clientId: string;
  displayName: string;
}): Promise<GroupState> {
  const res = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Failed to create group");
  }

  const data = (await res.json()) as GroupStateResponse;
  return persistSession(data.group.id, data);
}

export async function fetchGroupState(
  groupId: string
): Promise<GroupState | null> {
  const result = await pollGroupState(groupId);
  return result.status === "ok" ? result.state : null;
}

export async function joinGroupRequest(input: {
  groupId: string;
  clientId: string;
  displayName: string;
}): Promise<GroupState> {
  const res = await fetch(`/api/groups/${input.groupId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error("Failed to join group");

  const data = (await res.json()) as GroupStateResponse;
  return persistSession(input.groupId, data);
}

export async function startSyncGroupRequest(
  groupId: string,
  clientId: string
): Promise<GroupState> {
  const res = await fetch(`/api/groups/${groupId}/start`, {
    method: "POST",
    headers: jsonHeaders(groupId),
    body: JSON.stringify({ clientId }),
  });

  if (!res.ok) throw new Error("Failed to start group");
  return res.json() as Promise<GroupState>;
}

export async function saveGroupAnswerRequest(input: {
  groupId: string;
  clientId: string;
  cardId: string;
  cardType: "balance" | "question";
  selectedOption?: "A" | "B";
  selectedLabel?: string;
  answerText?: string;
}): Promise<GroupState> {
  const res = await fetch(`/api/groups/${input.groupId}/answers`, {
    method: "POST",
    headers: jsonHeaders(input.groupId),
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error("Failed to save answer");
  return res.json() as Promise<GroupState>;
}

export async function completeGroupParticipantRequest(
  groupId: string,
  clientId: string
): Promise<GroupState> {
  const res = await fetch(`/api/groups/${groupId}/complete`, {
    method: "POST",
    headers: jsonHeaders(groupId),
    body: JSON.stringify({ clientId }),
  });

  if (!res.ok) throw new Error("Failed to complete");
  return res.json() as Promise<GroupState>;
}

export async function advanceSyncCardRequest(
  groupId: string,
  clientId: string
): Promise<GroupState> {
  const res = await fetch(`/api/groups/${groupId}/sync`, {
    method: "POST",
    headers: jsonHeaders(groupId),
    body: JSON.stringify({ clientId, action: "next" }),
  });

  if (!res.ok) throw new Error("Failed to advance");
  return res.json() as Promise<GroupState>;
}

export async function finishSyncGroupRequest(
  groupId: string,
  clientId: string
): Promise<GroupState> {
  const res = await fetch(`/api/groups/${groupId}/sync`, {
    method: "POST",
    headers: jsonHeaders(groupId),
    body: JSON.stringify({ clientId, action: "finish" }),
  });

  if (!res.ok) throw new Error("Failed to finish");
  return res.json() as Promise<GroupState>;
}

export async function updateProgressRequest(
  groupId: string,
  clientId: string,
  progressIndex: number
): Promise<GroupState> {
  const res = await fetch(`/api/groups/${groupId}/progress`, {
    method: "POST",
    headers: jsonHeaders(groupId),
    body: JSON.stringify({ clientId, progressIndex }),
  });

  if (!res.ok) throw new Error("Failed to update progress");
  return res.json() as Promise<GroupState>;
}

export type AdvanceAsyncPlayResult =
  | { ok: true; kind: "next"; nextIndex: number }
  | { ok: true; kind: "complete" }
  | { ok: false };

export async function advanceAsyncPlayRequest(input: {
  groupId: string;
  clientId: string;
  cardId: string;
  cardType: "balance" | "question";
  cardIndex: number;
  totalCards: number;
  selectedOption?: "A" | "B";
  selectedLabel?: string;
}): Promise<AdvanceAsyncPlayResult> {
  const res = await fetch(`/api/groups/${input.groupId}/advance-play`, {
    method: "POST",
    headers: jsonHeaders(input.groupId),
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    return { ok: false };
  }

  return res.json() as Promise<AdvanceAsyncPlayResult>;
}
