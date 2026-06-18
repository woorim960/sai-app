import { getRepository } from "@/lib/api";
import { requireHostSession } from "@/lib/group/api-auth";
import { groupErrorResponse, groupJsonResponse } from "@/lib/group/api-response";
import { getGroupRepository } from "@/lib/group/index";
import { allParticipantsAnswered, canAdvanceSyncCard } from "@/lib/group/sync-card-progress";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { groupId } = await context.params;
  const body = (await request.json()) as {
    clientId?: string;
    action?: "next" | "finish";
  };

  if (!body.clientId || !body.action) {
    return groupErrorResponse("Invalid request", 400);
  }

  const repo = getGroupRepository();
  const auth = await requireHostSession(request, groupId, repo);

  if (!auth.ok) {
    return groupErrorResponse(auth.error, auth.status);
  }

  if (auth.payload.clientId !== body.clientId) {
    return groupErrorResponse("Forbidden", 403);
  }

  const cards = await getRepository().getCardsByDeckId(auth.state.group.deckId);
  const maxCardIndex = Math.max(0, cards.length - 1);
  const currentCard = cards[auth.state.group.currentCardIndex];

  if (!currentCard || !canAdvanceSyncCard(auth.state, currentCard)) {
    return groupErrorResponse(
      currentCard?.type === "balance"
        ? "모든 참여자의 선택이 필요해요"
        : "모든 참여자의 답변이 필요해요",
      409
    );
  }

  const state =
    body.action === "next"
      ? await repo.advanceSyncCard(groupId, body.clientId, maxCardIndex)
      : await repo.finishSyncGroup(groupId, body.clientId);

  if (!state) {
    return groupErrorResponse("Not found", 404);
  }

  return groupJsonResponse(state);
}
