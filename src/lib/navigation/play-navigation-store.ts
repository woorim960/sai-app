"use client";

import { useSyncExternalStore } from "react";
import type { GroupMode } from "@/lib/group/types";

type PlayNavigationState = {
  visible: boolean;
  mode: GroupMode | null;
};

let state: PlayNavigationState = { visible: false, mode: null };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function showPlayNavigation(mode: GroupMode): void {
  state = { visible: true, mode };
  emit();
}

export function hidePlayNavigation(): void {
  if (!state.visible) return;
  state = { visible: false, mode: null };
  emit();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): PlayNavigationState {
  return state;
}

export function usePlayNavigation(): PlayNavigationState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
