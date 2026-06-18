import type { NextRequest } from "next/server";
import { requireGroupSession } from "@/lib/group/api-auth";
import { getGroupRepository } from "@/lib/group/index";
import { redirectToPath } from "@/lib/request-redirect";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { groupId } = await context.params;
  const playPath = `/group/${groupId}/play`;
  const url = new URL(request.url);

  const cardId = url.searchParams.get("cardId")?.trim() ?? "";
  const cardType = url.searchParams.get("cardType")?.trim() ?? "";
  const cardIndex = Number(url.searchParams.get("cardIndex") ?? "");
  const totalCards = Number(url.searchParams.get("totalCards") ?? "");
  const optionA = url.searchParams.get("optionA") ?? "";
  const optionB = url.searchParams.get("optionB") ?? "";
  const selectedRaw = url.searchParams.get("selectedOption");
  const selectedOption =
    selectedRaw === "A" || selectedRaw === "B" ? selectedRaw : undefined;

  if (
    !cardId ||
    !Number.isFinite(cardIndex) ||
    !Number.isFinite(totalCards) ||
    totalCards < 1 ||
    (cardType !== "balance" && cardType !== "question")
  ) {
    return redirectToPath(request, `${playPath}?error=invalid`);
  }

  const repo = getGroupRepository();
  const auth = await requireGroupSession(request, groupId, repo);
  if (!auth.ok) {
    return redirectToPath(request, `${playPath}?error=session`);
  }

  if (auth.state.group.mode !== "async") {
    return redirectToPath(request, playPath);
  }

  const clientId = auth.payload.clientId;

  if (cardType === "balance" && !selectedOption) {
    return redirectToPath(request, `${playPath}?error=select`);
  }

  const saved = await repo.saveGroupAnswer({
    groupId,
    clientId,
    cardId,
    cardType,
    selectedOption,
    selectedLabel:
      selectedOption === "A"
        ? optionA
        : selectedOption === "B"
          ? optionB
          : undefined,
  });

  if (!saved) {
    return redirectToPath(request, `${playPath}?error=save`);
  }

  const isLast = cardIndex >= totalCards - 1;

  if (isLast) {
    await repo.completeParticipant(groupId, clientId);
    return redirectToPath(request, `/group/${groupId}/result`);
  }

  const nextIndex = cardIndex + 1;
  await repo.updateParticipantProgress(groupId, clientId, nextIndex);
  return redirectToPath(request, `${playPath}?i=${nextIndex}`);
}
