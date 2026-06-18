import { getRepository } from "@/lib/api";
import { requireGroupSession } from "@/lib/group/api-auth";
import { groupErrorResponse, groupJsonResponse } from "@/lib/group/api-response";
import { getGroupRepository } from "@/lib/group/index";
import { MAX_QUESTION_ANSWER_LENGTH } from "@/lib/group/sync-card-progress";

type RouteContext = { params: Promise<{ groupId: string }> };

function normalizeAnswerText(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, MAX_QUESTION_ANSWER_LENGTH);
}

export async function POST(request: Request, context: RouteContext) {
  const { groupId } = await context.params;
  const body = (await request.json()) as {
    clientId?: string;
    cardId?: string;
    cardType?: "balance" | "question";
    selectedOption?: "A" | "B";
    selectedLabel?: string;
    answerText?: string;
  };

  if (!body.clientId || !body.cardId || !body.cardType) {
    return groupErrorResponse("Invalid request", 400);
  }

  const repo = getGroupRepository();
  const auth = await requireGroupSession(request, groupId, repo);
  if (!auth.ok) {
    return groupErrorResponse(auth.error, auth.status);
  }

  if (auth.payload.clientId !== body.clientId) {
    return groupErrorResponse("Forbidden", 403);
  }

  if (auth.state.group.mode === "sync" && auth.state.group.status === "playing") {
    const cards = await getRepository().getCardsByDeckId(auth.state.group.deckId);
    const activeCard = cards[auth.state.group.currentCardIndex];
    if (!activeCard || activeCard.id !== body.cardId) {
      return groupErrorResponse("현재 카드가 아니에요", 409);
    }
  }

  const state = await repo.saveGroupAnswer({
    groupId,
    clientId: body.clientId,
    cardId: body.cardId,
    cardType: body.cardType,
    selectedOption: body.selectedOption,
    selectedLabel: body.selectedLabel,
    answerText: normalizeAnswerText(body.answerText),
  });

  if (!state) {
    return groupErrorResponse("Not found", 404);
  }

  return groupJsonResponse(state);
}
