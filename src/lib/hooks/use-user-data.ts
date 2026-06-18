"use client";

import { useSyncExternalStore } from "react";
import {
  getFavoriteDeckIds,
  getNotifications,
  getPlayHistory,
  getUserStats,
  type AppNotification,
  type PlayHistoryEntry,
} from "@/lib/user-data";

const EMPTY_NOTIFICATIONS: AppNotification[] = [];
const EMPTY_FAVORITE_IDS: string[] = [];
const EMPTY_HISTORY: PlayHistoryEntry[] = [];
const EMPTY_STATS = {
  completedCount: 0,
  favoriteCount: 0,
  historyCount: 0,
};

type UserDataCache = {
  notifications: AppNotification[];
  unreadCount: number;
  favoriteIds: string[];
  history: PlayHistoryEntry[];
  stats: typeof EMPTY_STATS;
};

let cache: UserDataCache = {
  notifications: EMPTY_NOTIFICATIONS,
  unreadCount: 0,
  favoriteIds: EMPTY_FAVORITE_IDS,
  history: EMPTY_HISTORY,
  stats: EMPTY_STATS,
};

function isSameJson(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function refreshCache(): void {
  const notifications = getNotifications();
  if (!isSameJson(notifications, cache.notifications)) {
    cache.notifications = notifications;
  }

  const unreadCount = notifications.filter((item) => !item.read).length;
  if (unreadCount !== cache.unreadCount) {
    cache.unreadCount = unreadCount;
  }

  const favoriteIds = getFavoriteDeckIds();
  if (!isSameJson(favoriteIds, cache.favoriteIds)) {
    cache.favoriteIds = favoriteIds;
  }

  const history = getPlayHistory();
  if (!isSameJson(history, cache.history)) {
    cache.history = history;
  }

  const stats = getUserStats();
  if (!isSameJson(stats, cache.stats)) {
    cache.stats = stats;
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => {
    refreshCache();
    callback();
  };

  window.addEventListener("sai-user-data-changed", handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener("sai-user-data-changed", handler);
    window.removeEventListener("storage", handler);
  };
}

function getNotificationsSnapshot(): AppNotification[] {
  refreshCache();
  return cache.notifications;
}

function getUnreadCountSnapshot(): number {
  refreshCache();
  return cache.unreadCount;
}

function getFavoriteIdsSnapshot(): string[] {
  refreshCache();
  return cache.favoriteIds;
}

function getHistorySnapshot(): PlayHistoryEntry[] {
  refreshCache();
  return cache.history;
}

function getStatsSnapshot(): typeof EMPTY_STATS {
  refreshCache();
  return cache.stats;
}

export function useNotifications(): AppNotification[] {
  return useSyncExternalStore(
    subscribe,
    getNotificationsSnapshot,
    () => EMPTY_NOTIFICATIONS
  );
}

export function useUnreadNotificationCount(): number {
  return useSyncExternalStore(
    subscribe,
    getUnreadCountSnapshot,
    () => 0
  );
}

export function useFavoriteDeckIds(): string[] {
  return useSyncExternalStore(
    subscribe,
    getFavoriteIdsSnapshot,
    () => EMPTY_FAVORITE_IDS
  );
}

export function usePlayHistory(): PlayHistoryEntry[] {
  return useSyncExternalStore(
    subscribe,
    getHistorySnapshot,
    () => EMPTY_HISTORY
  );
}

export function useUserStatsSnapshot() {
  return useSyncExternalStore(subscribe, getStatsSnapshot, () => EMPTY_STATS);
}

export function useFavoriteDeck(deckId: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => {
      refreshCache();
      return cache.favoriteIds.includes(deckId);
    },
    () => false
  );
}
