/** 세션 토큰 payload에서 clientId 추출 (서명 검증 없음 — 로컬 식별 복구용) */
export function getClientIdFromSessionToken(token: string): string | null {
  const [encoded] = token.split(".");
  if (!encoded) return null;

  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    const payload = JSON.parse(json) as { clientId?: string };
    return typeof payload.clientId === "string" ? payload.clientId : null;
  } catch {
    return null;
  }
}
