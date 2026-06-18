import {
  parsePremiumUnlockedCookie,
  PREMIUM_UNLOCKED_COOKIE,
} from "./cookies";

export function getUnlockedPremiumDecksFromCookieValue(
  cookieValue: string | undefined
): string[] {
  return parsePremiumUnlockedCookie(cookieValue);
}

export { PREMIUM_UNLOCKED_COOKIE };
