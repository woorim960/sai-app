const COUPLE_ID_KEY = "sai_couple_id";
const COUPLE_TOKEN_KEY = "sai_couple_token";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export type CoupleSession = {
  coupleId: string;
  token: string;
};

export function getCoupleSession(): CoupleSession | null {
  if (!isBrowser()) return null;
  const coupleId = localStorage.getItem(COUPLE_ID_KEY);
  const token = localStorage.getItem(COUPLE_TOKEN_KEY);
  if (!coupleId || !token) return null;
  return { coupleId, token };
}

export function saveCoupleSession(session: CoupleSession): void {
  if (!isBrowser()) return;
  localStorage.setItem(COUPLE_ID_KEY, session.coupleId);
  localStorage.setItem(COUPLE_TOKEN_KEY, session.token);
  window.dispatchEvent(new Event("sai-couple-changed"));
}

export function clearCoupleSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(COUPLE_ID_KEY);
  localStorage.removeItem(COUPLE_TOKEN_KEY);
  window.dispatchEvent(new Event("sai-couple-changed"));
}
