import { getRepository } from "@/lib/api";
import { groupErrorResponse, groupJsonResponse } from "@/lib/group/api-response";
import { getGroupRepository } from "@/lib/group/index";
import { createGroupSessionToken } from "@/lib/group/session";
import type { GroupMode } from "@/lib/group/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    deckId?: string;
    mode?: GroupMode;
    clientId?: string;
    displayName?: string;
  };

  if (!body.deckId || !body.mode || !body.clientId || !body.displayName) {
    return groupErrorResponse("Invalid request", 400);
  }

  const deck = await getRepository().getDeckById(body.deckId);
  if (!deck) {
    return groupErrorResponse("Deck not found", 404);
  }

  const cards = await getRepository().getCardsByDeckId(body.deckId);
  if (cards.length === 0) {
    return groupErrorResponse("Deck has no cards", 400);
  }

  const repo = getGroupRepository();
  const state = await repo.createGroup({
    deckId: body.deckId,
    mode: body.mode,
    hostClientId: body.clientId,
    hostDisplayName: body.displayName,
  });

  const sessionToken = createGroupSessionToken(state.group.id, body.clientId);

  return groupJsonResponse({ ...state, sessionToken });
}
