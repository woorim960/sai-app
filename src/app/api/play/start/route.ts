import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getDeckByIdCached } from "@/lib/api/cached-data";
import {
  CLIENT_ID_COOKIE,
  DISPLAY_NAME_COOKIE,
  groupSessionCookieMaxAge,
  groupSessionCookieName,
} from "@/lib/cookies";
import { getGroupRepository } from "@/lib/group/index";
import { createGroupSessionToken } from "@/lib/group/session";
import type { GroupMode } from "@/lib/group/types";
import { redirectToPath } from "@/lib/request-redirect";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const deckId = url.searchParams.get("deckId");
  const mode = url.searchParams.get("mode");

  if (!deckId || (mode !== "async" && mode !== "sync")) {
    return redirectToPath(request, "/home");
  }

  const deck = await getDeckByIdCached(deckId);
  const deckPath = `/decks/${deckId}`;

  if (!deck) {
    return redirectToPath(request, `${deckPath}?error=not_found`);
  }

  if (deck.cardCount < 1) {
    return redirectToPath(request, `${deckPath}?error=no_cards`);
  }

  let clientId = request.cookies.get(CLIENT_ID_COOKIE)?.value?.trim();
  if (!clientId) {
    clientId = randomUUID();
  }

  const displayName =
    request.cookies.get(DISPLAY_NAME_COOKIE)?.value?.trim() || "플레이어";

  try {
    const state = await getGroupRepository().createGroup({
      deckId,
      mode: mode as GroupMode,
      hostClientId: clientId,
      hostDisplayName: displayName,
    });

    const groupId = state.group.id;
    const sessionToken = createGroupSessionToken(groupId, clientId);
    const bootstrap = new URLSearchParams({
      sid: clientId,
      st: sessionToken,
    });
    const targetPath =
      mode === "async"
        ? `/group/${groupId}/play?${bootstrap.toString()}`
        : `/room/${groupId}?${bootstrap.toString()}`;

    const response = redirectToPath(request, targetPath);

    response.cookies.set(CLIENT_ID_COOKIE, clientId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    response.cookies.set(groupSessionCookieName(groupId), sessionToken, {
      path: "/",
      maxAge: groupSessionCookieMaxAge(),
      sameSite: "lax",
    });

    return response;
  } catch {
    return redirectToPath(request, `${deckPath}?error=start_failed`);
  }
}
