import { getClientId } from "@/lib/client-id";
import {
  buildLoveProfile,
  createEmptyScores,
  getCanonicalPersona,
  parseProfile,
  serializeProfile,
  type LoveProfile,
  type LoveTypeId,
} from "@/lib/together/compatibility";
import type { SavedCompatResult } from "@/lib/together/compatibility-results";

const STORAGE_KEY = "sai_compat_result";
const HISTORY_KEY = "sai_compat_history";
const MAX_HISTORY = 5;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

type StoredPayload = {
  clientId: string;
  loveTypeId: LoveTypeId;
  profile: LoveProfile;
  completedAt: string;
};

type HistoryEntry = {
  profile: LoveProfile;
  completedAt: string;
};

type HistoryPayload = {
  clientId: string;
  entries: HistoryEntry[];
};

function readHistoryPayload(): HistoryPayload | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HistoryPayload;
  } catch {
    return null;
  }
}

export function loadCompatHistory(): HistoryEntry[] {
  const clientId = getClientId();
  if (!clientId) return [];
  const payload = readHistoryPayload();
  if (!payload || payload.clientId !== clientId) return [];
  return payload.entries;
}

function pushCompatHistory(previous: SavedCompatResult): void {
  if (!isBrowser()) return;
  const clientId = getClientId();
  if (!clientId || !previous.profile) return;

  const existing = readHistoryPayload();
  const entries = existing?.clientId === clientId ? [...existing.entries] : [];

  const isDuplicate =
    entries[0]?.completedAt === previous.completedAt &&
    entries[0]?.profile.type === previous.profile.type;

  if (!isDuplicate) {
    entries.unshift({
      profile: previous.profile,
      completedAt: previous.completedAt,
    });
  }

  const payload: HistoryPayload = {
    clientId,
    entries: entries.slice(0, MAX_HISTORY),
  };
  localStorage.setItem(HISTORY_KEY, JSON.stringify(payload));
}

export function loadLocalCompatResult(): SavedCompatResult | null {
  if (!isBrowser()) return null;

  const clientId = getClientId();
  if (!clientId) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPayload;
    if (parsed.clientId !== clientId || !parsed.loveTypeId) return null;

    return {
      loveTypeId: parsed.loveTypeId,
      profile: parsed.profile,
      completedAt: parsed.completedAt,
      source: "local",
    };
  } catch {
    return null;
  }
}

export function saveLocalCompatProfile(profile: LoveProfile): SavedCompatResult | null {
  if (!isBrowser()) return null;

  const clientId = getClientId();
  if (!clientId) return null;

  const previous = loadLocalCompatResult();

  const result: SavedCompatResult = {
    loveTypeId: profile.type,
    profile,
    completedAt: new Date().toISOString(),
    source: "local",
  };

  if (previous?.profile) {
    pushCompatHistory(previous);
  }

  const payload: StoredPayload = {
    clientId,
    loveTypeId: profile.type,
    profile,
    completedAt: result.completedAt,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event("sai-compat-changed"));
  return result;
}

export function saveLocalCompatResult(loveTypeId: LoveTypeId): SavedCompatResult | null {
  const profile = buildLoveProfile(createEmptyScores());
  profile.type = loveTypeId;
  profile.persona = getCanonicalPersona(loveTypeId);
  return saveLocalCompatProfile(profile);
}

export function clearLocalCompatResult(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new Event("sai-compat-changed"));
}

export function loadLocalCompatProfile(): LoveProfile | null {
  const saved = loadLocalCompatResult();
  return saved?.profile ?? null;
}

export function parseStoredProfile(note?: string | null): LoveProfile | null {
  return parseProfile(note);
}

export function profileToNote(profile: LoveProfile): string {
  return serializeProfile(profile);
}
