import type { Group } from "./types";

const DEFAULT_TTL_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getGroupTtlDays(): number {
  const raw = process.env.GROUP_TTL_DAYS;
  if (!raw) return DEFAULT_TTL_DAYS;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_TTL_DAYS;
  return parsed;
}

export function getGroupTtlMs(): number {
  return getGroupTtlDays() * MS_PER_DAY;
}

export function computeGroupExpiresAt(fromIso: string = new Date().toISOString()): string {
  const expiresAt = new Date(fromIso).getTime() + getGroupTtlMs();
  return new Date(expiresAt).toISOString();
}

export function isGroupExpired(group: Pick<Group, "expiresAt">): boolean {
  return new Date(group.expiresAt).getTime() <= Date.now();
}

export function formatExpiresIn(expiresAt: string): string {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return "만료됨";

  const days = Math.ceil(diffMs / MS_PER_DAY);
  if (days <= 1) return "오늘 만료";
  return `${days}일 후 만료`;
}
