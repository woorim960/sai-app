import { NextRequest } from "next/server";
import { getRepository } from "@/lib/api";
import {
  parsePremiumUnlockedCookie,
  PREMIUM_UNLOCKED_COOKIE,
  serializePremiumUnlockedCookie,
} from "@/lib/cookies";
import { redirectToPath } from "@/lib/request-redirect";

type RouteContext = {
  params: Promise<{ deckId: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { deckId } = await context.params;
  const deck = await getRepository().getDeckById(deckId);
  const deckPath = `/decks/${deckId}`;

  if (!deck) {
    return redirectToPath(request, "/home");
  }

  const existing = parsePremiumUnlockedCookie(
    request.cookies.get(PREMIUM_UNLOCKED_COOKIE)?.value
  );
  const next = existing.includes(deckId) ? existing : [...existing, deckId];

  const response = redirectToPath(request, deckPath);

  response.cookies.set(
    PREMIUM_UNLOCKED_COOKIE,
    serializePremiumUnlockedCookie(next),
    {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    }
  );

  return response;
}
