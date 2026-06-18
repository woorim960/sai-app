"use client";

import { useSyncExternalStore } from "react";
import {
  getHomeExperimentChangeEventName,
  getHomeExperimentMetrics,
} from "@/lib/home-experiment";

type Snapshot = ReturnType<typeof getHomeExperimentMetrics>;

let cachedMetrics: Snapshot = getHomeExperimentMetrics();
const EMPTY_METRICS: Snapshot = {
  A: {
    views: 0,
    featuredClicks: 0,
    popularClicks: 0,
    quickThemeClicks: 0,
    contextChanges: 0,
    deckDetailViews: 0,
    asyncStarts: 0,
    syncStarts: 0,
  },
  B: {
    views: 0,
    featuredClicks: 0,
    popularClicks: 0,
    quickThemeClicks: 0,
    contextChanges: 0,
    deckDetailViews: 0,
    asyncStarts: 0,
    syncStarts: 0,
  },
};

function subscribe(callback: () => void) {
  const changeEvent = getHomeExperimentChangeEventName();

  const handler = () => {
    cachedMetrics = getHomeExperimentMetrics();
    callback();
  };

  window.addEventListener(changeEvent, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(changeEvent, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useHomeExperimentMetrics(): Snapshot {
  return useSyncExternalStore(
    subscribe,
    () => cachedMetrics,
    () => EMPTY_METRICS
  );
}
