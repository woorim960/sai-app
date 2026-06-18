import { requireGroupSession } from "@/lib/group/api-auth";
import { groupErrorResponse, groupJsonResponse } from "@/lib/group/api-response";
import { getGroupRepository } from "@/lib/group/index";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { groupId } = await context.params;
  const body = (await request.json()) as {
    clientId?: string;
    cardId?: string;
    cardType?: "balance" | "question";
    cardIndex?: number;
    totalCards?: number;
    selectedOption?: "A" | "B";
    selectedLabel?: string;
  };

  if (
    !body.clientId ||
    !body.cardId ||
    !body.cardType ||
    !Number.isFinite(body.cardIndex) ||
    !Number.isFinite(body.totalCards)
  ) {
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

  if (auth.state.group.mode !== "async") {
    return groupErrorResponse("Async only", 400);
  }

  if (body.cardType === "balance" && !body.selectedOption) {
    return groupErrorResponse("Selection required", 400);
  }

  const advanced = await repo.advanceAsyncParticipant({
    groupId,
    clientId: body.clientId,
    cardId: body.cardId,
    cardType: body.cardType,
    selectedOption: body.selectedOption,
    selectedLabel: body.selectedLabel,
    cardIndex: body.cardIndex!,
    totalCards: body.totalCards!,
  });

  if (!advanced.ok) {
    return groupErrorResponse("Failed to advance", 500);
  }

  return groupJsonResponse(advanced);
}
