import { getDailyQuestion, getTodayKey } from "@/lib/together/daily";
import { showLocalNotification } from "@/lib/notifications/push";

export type PlayHistoryEntry = {
  id: string;
  deckId: string;
  deckTitle: string;
  completedAt: string;
  mode: "async" | "sync";
  groupId?: string;
  resultHref?: string;
};

export type AppNotificationType =
  | "welcome"
  | "deck_completed"
  | "friend_joined"
  | "comparison_ready"
  | "daily_question"
  | "anniversary";

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  createdAt: string;
};

const FAVORITES_KEY = "sai_favorite_decks";
const PLAY_HISTORY_KEY = "sai_play_history";
const NOTIFICATIONS_KEY = "sai_notifications";
const WELCOME_SENT_KEY = "sai_welcome_notification_sent";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getFavoriteDeckIds(): string[] {
  return readJson<string[]>(FAVORITES_KEY, []);
}

export function isFavoriteDeck(deckId: string): boolean {
  return getFavoriteDeckIds().includes(deckId);
}

export function toggleFavoriteDeck(deckId: string): boolean {
  const favorites = getFavoriteDeckIds();
  const exists = favorites.includes(deckId);
  const next = exists
    ? favorites.filter((id) => id !== deckId)
    : [...favorites, deckId];
  writeJson(FAVORITES_KEY, next);
  window.dispatchEvent(new Event("sai-user-data-changed"));
  return !exists;
}

export function getPlayHistory(): PlayHistoryEntry[] {
  return readJson<PlayHistoryEntry[]>(PLAY_HISTORY_KEY, []).sort((a, b) =>
    b.completedAt.localeCompare(a.completedAt)
  );
}

export function addPlayHistoryEntry(input: {
  deckId: string;
  deckTitle: string;
  mode: "async" | "sync";
  groupId?: string;
  resultHref?: string;
}): void {
  const entry: PlayHistoryEntry = {
    id: createId("history"),
    deckId: input.deckId,
    deckTitle: input.deckTitle,
    completedAt: new Date().toISOString(),
    mode: input.mode,
    groupId: input.groupId,
    resultHref: input.resultHref,
  };
  const history = getPlayHistory().filter((item) => item.deckId !== input.deckId);
  writeJson(PLAY_HISTORY_KEY, [entry, ...history].slice(0, 30));
  window.dispatchEvent(new Event("sai-user-data-changed"));
}

export function getNotifications(): AppNotification[] {
  return readJson<AppNotification[]>(NOTIFICATIONS_KEY, []).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function getUnreadNotificationCount(): number {
  return getNotifications().filter((item) => !item.read).length;
}

export function addNotification(
  input: Omit<AppNotification, "id" | "read" | "createdAt"> & {
    id?: string;
    read?: boolean;
    createdAt?: string;
  }
): void {
  const notifications = getNotifications();
  if (input.id && notifications.some((item) => item.id === input.id)) {
    return;
  }

  const next: AppNotification = {
    id: input.id ?? createId("notice"),
    type: input.type,
    title: input.title,
    body: input.body,
    href: input.href,
    read: input.read ?? false,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };

  writeJson(NOTIFICATIONS_KEY, [next, ...notifications].slice(0, 50));
  window.dispatchEvent(new Event("sai-user-data-changed"));

  // 권한이 허용된 경우 앱 내 알림을 OS 알림으로도 미러링
  void showLocalNotification(next.title, {
    body: next.body,
    url: next.href,
    tag: next.id,
  });
}

export function markNotificationRead(id: string): void {
  const notifications = getNotifications().map((item) =>
    item.id === id ? { ...item, read: true } : item
  );
  writeJson(NOTIFICATIONS_KEY, notifications);
  window.dispatchEvent(new Event("sai-user-data-changed"));
}

export function markAllNotificationsRead(): void {
  const notifications = getNotifications().map((item) => ({
    ...item,
    read: true,
  }));
  writeJson(NOTIFICATIONS_KEY, notifications);
  window.dispatchEvent(new Event("sai-user-data-changed"));
}

export function ensureWelcomeNotification(): void {
  if (!isBrowser()) return;
  if (localStorage.getItem(WELCOME_SENT_KEY) === "true") return;

  addNotification({
    id: "welcome",
    type: "welcome",
    title: "사이에 오신 걸 환영해요",
    body: "상황을 고르고 함께 플레이해보세요.",
    href: "/together",
  });
  localStorage.setItem(WELCOME_SENT_KEY, "true");
}

export function ensureDailyQuestionNotification(): void {
  if (!isBrowser()) return;

  const todayKey = getTodayKey();
  addNotification({
    id: `daily-${todayKey}`,
    type: "daily_question",
    title: "오늘의 질문이 도착했어요",
    body: `${getDailyQuestion(todayKey).text} 함께 답해보세요.`,
    href: "/together/daily",
  });
}

function daysSince(anniversary: string): number | null {
  const start = new Date(`${anniversary}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
}

/** 오늘이 기념일 마일스톤(100일 단위 / 주년)이면 축하 알림을 1회 등록 */
export function ensureAnniversaryNotifications(anniversary?: string): void {
  if (!isBrowser() || !anniversary) return;

  const days = daysSince(anniversary);
  if (days === null || days <= 0) return;

  const milestones: string[] = [];
  if (days % 100 === 0) milestones.push(`${days}일`);
  if (days % 365 === 0) milestones.push(`${days / 365}주년`);
  // 기념일 일주일 전 리마인드 (다가오는 100일/주년)
  const upcoming = days + 7;
  if (upcoming % 100 === 0 || upcoming % 365 === 0) {
    addNotification({
      id: `anniv-soon-${anniversary}-${upcoming}`,
      type: "anniversary",
      title: "기념일이 다가와요 💝",
      body:
        upcoming % 365 === 0
          ? `7일 뒤 ${upcoming / 365}주년이에요. 특별한 준비를 해볼까요?`
          : `7일 뒤 ${upcoming}일이에요. 함께 축하해요!`,
      href: "/together",
    });
  }

  for (const label of milestones) {
    addNotification({
      id: `anniv-${anniversary}-${days}-${label}`,
      type: "anniversary",
      title: "기념일 축하해요 🎉",
      body: `함께한 지 ${label}이 되었어요!`,
      href: "/together",
    });
  }
}

export function notifyDeckCompleted(deckTitle: string, deckId: string): void {
  addNotification({
    type: "deck_completed",
    title: "플레이를 완료했어요",
    body: `「${deckTitle}」 결과를 확인해보세요.`,
    href: `/decks/${deckId}`,
  });
}

export function notifyFriendJoined(displayName: string, groupId: string, mode: "async" | "sync"): void {
  addNotification({
    type: "friend_joined",
    title: "새로운 참가자",
    body: `${displayName}님이 참여했어요.`,
    href: mode === "async" ? `/group/${groupId}/result` : `/room/${groupId}`,
  });
}

export function notifyComparisonReady(groupId: string): void {
  addNotification({
    id: `comparison-${groupId}`,
    type: "comparison_ready",
    title: "비교 결과가 열렸어요",
    body: "2명 이상 완료! 서로의 선택을 비교해보세요.",
    href: `/group/${groupId}/result`,
  });
}

export function getUserStats(): {
  completedCount: number;
  favoriteCount: number;
  historyCount: number;
} {
  const completed = readJson<string[]>("sai_completed_decks", []);
  return {
    completedCount: completed.length,
    favoriteCount: getFavoriteDeckIds().length,
    historyCount: getPlayHistory().length,
  };
}
