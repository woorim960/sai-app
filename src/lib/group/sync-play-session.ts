import { groupSessionCookieName, readBrowserCookie } from "@/lib/cookies";
import { getClientIdFromSessionToken } from "@/lib/group/session-client";
import { saveGroupSessionToken } from "@/lib/group/session-storage";

const SESSIONS_KEY = "sai_group_sessions";

/** URL 쿼리(sid/st) 또는 쿠키에서 플레이 세션 복구 */
export function syncPlaySessionFromUrl(groupId: string): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const sid = params.get("sid");
  const st = params.get("st") ?? readBrowserCookie(groupSessionCookieName(groupId));

  if (sid) {
    localStorage.setItem("sai_client_id", sid);
    document.cookie = `sai_client_id=${encodeURIComponent(sid)}; path=/; max-age=31536000; SameSite=Lax`;
  }

  if (st) {
    const sessions: Record<string, string> = {};
    try {
      Object.assign(
        sessions,
        JSON.parse(localStorage.getItem(SESSIONS_KEY) || "{}") as Record<
          string,
          string
        >
      );
    } catch {
      /* ignore */
    }
    sessions[groupId] = st;
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    document.cookie = `${groupSessionCookieName(groupId)}=${encodeURIComponent(st)}; path=/; max-age=604800; SameSite=Lax`;

    const tokenClientId = getClientIdFromSessionToken(st);
    if (tokenClientId) {
      localStorage.setItem("sai_client_id", tokenClientId);
    }
  }

  if (sid || st || params.has("i") || params.has("error")) {
    params.delete("sid");
    params.delete("st");
    params.delete("i");
    params.delete("error");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState(null, "", nextUrl);
  }
}
