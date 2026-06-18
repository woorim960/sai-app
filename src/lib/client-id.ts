"use client";

import { useLayoutEffect, useState } from "react";

import { CLIENT_ID_COOKIE, readBrowserCookie, writeBrowserCookie } from "@/lib/cookies";

const CLIENT_ID_KEY = "sai_client_id";
const DISPLAY_NAME_KEY = "sai_display_name";

function generateClientId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getClientId(): string {
  if (typeof window === "undefined") return "";

  const fromCookie = readBrowserCookie(CLIENT_ID_COOKIE);
  const fromStorage = localStorage.getItem(CLIENT_ID_KEY);

  if (fromCookie) {
    if (fromStorage !== fromCookie) {
      localStorage.setItem(CLIENT_ID_KEY, fromCookie);
    }
    return fromCookie;
  }

  if (fromStorage) {
    setClientId(fromStorage);
    return fromStorage;
  }

  const id = generateClientId();
  setClientId(id);
  return id;
}

export function setClientId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLIENT_ID_KEY, id);
  writeBrowserCookie(CLIENT_ID_COOKIE, id, 60 * 60 * 24 * 365);
}

export function getDisplayName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(DISPLAY_NAME_KEY) ?? "";
}

export function setDisplayName(name: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DISPLAY_NAME_KEY, name.trim());
}

export function getDefaultDisplayName(): string {
  const saved = getDisplayName();
  if (saved) return saved;
  return "플레이어";
}

export function useClientId(): string {
  const [clientId, setClientId] = useState("");

  useLayoutEffect(() => {
    setClientId(getClientId());
  }, []);

  return clientId;
}

export function useDefaultDisplayName(): string {
  const [name, setName] = useState("플레이어");

  useLayoutEffect(() => {
    setName(getDefaultDisplayName());
  }, []);

  return name;
}

export function useHasClientId(): boolean {
  return useClientId() !== "";
}
