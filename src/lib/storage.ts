import { setOnboardingCookie, setPremiumUnlockedCookie } from "./cookies";
import {
  parsePremiumUnlockedCookie,
  PREMIUM_UNLOCKED_COOKIE,
  readBrowserCookie,
} from "./cookies";
import { addPlayHistoryEntry, notifyDeckCompleted } from "./user-data";
import type { CardPhase } from "@/lib/data";

const ONBOARDING_KEY = "sai_onboarding_complete";
const PLAY_PROGRESS_PREFIX = "sai_play_progress_";
const COMPLETED_DECKS_KEY = "sai_completed_decks";
const PREMIUM_UNLOCKED_KEY = "sai_premium_unlocked";
const PLAY_ANSWERS_PREFIX = "sai_play_answers_";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isOnboardingComplete(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

export function markOnboardingComplete(): void {
  if (!isBrowser()) return;
  localStorage.setItem(ONBOARDING_KEY, "true");
  setOnboardingCookie();
}

export function syncOnboardingCookie(): void {
  if (!isBrowser()) return;
  if (isOnboardingComplete()) {
    setOnboardingCookie();
  }
}

export function syncPremiumCookie(): void {
  if (!isBrowser()) return;
  const unlocked = getUnlockedPremiumDecks();
  if (unlocked.length > 0) {
    setPremiumUnlockedCookie(unlocked);
  }
}

export type PlayProgress = {
  currentIndex: number;
  selectedOption: "A" | "B" | null;
};

export function getPlayProgress(deckId: string): PlayProgress | null {
  if (!isBrowser()) return null;
  const raw = sessionStorage.getItem(`${PLAY_PROGRESS_PREFIX}${deckId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PlayProgress;
  } catch {
    return null;
  }
}

export function savePlayProgress(deckId: string, progress: PlayProgress): void {
  if (!isBrowser()) return;
  sessionStorage.setItem(
    `${PLAY_PROGRESS_PREFIX}${deckId}`,
    JSON.stringify(progress)
  );
}

export function clearPlayProgress(deckId: string): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(`${PLAY_PROGRESS_PREFIX}${deckId}`);
}

export function markDeckCompleted(
  deckId: string,
  options?: {
    deckTitle?: string;
    mode?: "async" | "sync";
    groupId?: string;
    resultHref?: string;
  }
): void {
  if (!isBrowser()) return;
  const completed = getCompletedDecks();
  if (!completed.includes(deckId)) {
    localStorage.setItem(
      COMPLETED_DECKS_KEY,
      JSON.stringify([...completed, deckId])
    );
  }
  clearPlayProgress(deckId);

  if (options?.deckTitle && options.mode) {
    addPlayHistoryEntry({
      deckId,
      deckTitle: options.deckTitle,
      mode: options.mode,
      groupId: options.groupId,
      resultHref: options.resultHref,
    });
    notifyDeckCompleted(options.deckTitle, deckId);
  }
}

export function getCompletedDecks(): string[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(COMPLETED_DECKS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function isDeckCompleted(deckId: string): boolean {
  return getCompletedDecks().includes(deckId);
}

export function getUnlockedPremiumDecks(): string[] {
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(PREMIUM_UNLOCKED_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }

  const cookieValue = readBrowserCookie(PREMIUM_UNLOCKED_COOKIE);
  if (!cookieValue) return [];

  try {
    const parsed = JSON.parse(cookieValue) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === "string");
    }
  } catch {
    return parsePremiumUnlockedCookie(encodeURIComponent(cookieValue));
  }

  return [];
}

export function isPremiumDeckUnlocked(deckId: string): boolean {
  return getUnlockedPremiumDecks().includes(deckId);
}

export function unlockPremiumDeck(deckId: string): void {
  if (!isBrowser()) return;
  const unlocked = getUnlockedPremiumDecks();
  if (unlocked.includes(deckId)) return;

  const next = [...unlocked, deckId];
  localStorage.setItem(PREMIUM_UNLOCKED_KEY, JSON.stringify(next));
  setPremiumUnlockedCookie(next);
}

export type CardAnswerRecord = {
  cardId: string;
  type: "balance" | "question";
  phase: CardPhase;
  selectedOption?: "A" | "B";
  selectedLabel?: string;
};

export function getPlayAnswers(deckId: string): CardAnswerRecord[] {
  if (!isBrowser()) return [];
  const raw = sessionStorage.getItem(`${PLAY_ANSWERS_PREFIX}${deckId}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CardAnswerRecord[];
  } catch {
    return [];
  }
}

export function saveCardAnswer(
  deckId: string,
  answer: CardAnswerRecord
): void {
  if (!isBrowser()) return;
  const existing = getPlayAnswers(deckId).filter(
    (item) => item.cardId !== answer.cardId
  );
  sessionStorage.setItem(
    `${PLAY_ANSWERS_PREFIX}${deckId}`,
    JSON.stringify([...existing, answer])
  );
}

export function clearPlayAnswers(deckId: string): void {
  if (!isBrowser()) return;
  sessionStorage.removeItem(`${PLAY_ANSWERS_PREFIX}${deckId}`);
}
