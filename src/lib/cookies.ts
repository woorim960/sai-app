export const ONBOARDING_COOKIE = "sai_onboarding_complete";
export const PREMIUM_UNLOCKED_COOKIE = "sai_premium_unlocked";
export const CLIENT_ID_COOKIE = "sai_client_id";
export const DISPLAY_NAME_COOKIE = "sai_display_name";

const GROUP_SESSION_COOKIE_PREFIX = "sai_gs_";
const GROUP_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function groupSessionCookieName(groupId: string): string {
  return `${GROUP_SESSION_COOKIE_PREFIX}${groupId}`;
}

export function groupSessionCookieMaxAge(): number {
  return GROUP_SESSION_MAX_AGE;
}

export function readBrowserCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const part = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));
  if (!part) return null;
  return decodeURIComponent(part.slice(prefix.length));
}

export function writeBrowserCookie(
  name: string,
  value: string,
  maxAge = GROUP_SESSION_MAX_AGE
): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function setOnboardingCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${ONBOARDING_COOKIE}=true; path=/; max-age=31536000; SameSite=Lax`;
}

export function hasOnboardingCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${ONBOARDING_COOKIE}=true`));
}

export function parsePremiumUnlockedCookie(
  value: string | undefined
): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is string => typeof id === "string");
    }
  } catch {
    return value.split(",").filter(Boolean);
  }
  return [];
}

export function serializePremiumUnlockedCookie(ids: string[]): string {
  return encodeURIComponent(JSON.stringify(ids));
}

export function setPremiumUnlockedCookie(ids: string[]): void {
  if (typeof document === "undefined") return;
  document.cookie = `${PREMIUM_UNLOCKED_COOKIE}=${serializePremiumUnlockedCookie(ids)}; path=/; max-age=31536000; SameSite=Lax`;
}
