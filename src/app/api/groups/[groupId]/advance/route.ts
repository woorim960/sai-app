import type { NextRequest } from "next/server";
import { requireGroupSession } from "@/lib/group/api-auth";
import { getGroupRepository } from "@/lib/group/index";
import { redirectToPath } from "@/lib/request-redirect";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const { groupId } = await context.params;
  const playPath = `/group/${groupId}/play`;

  const form = await request.formData();
  const cardId = String(form.get("cardId") ?? "").trim();
  const cardType = String(form.get("cardType") ?? "").trim();
  const cardIndex = Number(form.get("cardIndex") ?? "");
  const totalCards = Number(form.get("totalCards") ?? "");
  const optionA = String(form.get("optionA") ?? "");
  const optionB = String(form.get("optionB") ?? "");
  const selectedRaw = form.get("selectedOption");
  const selectedOption =
    selectedRaw === "A" || selectedRaw === "B" ? selectedRaw : undefined;
  const sessionToken = String(form.get("st") ?? "").trim();

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
  const auth = await requireGroupSession(request, groupId, repo, {
    fallbackToken: sessionToken || undefined,
  });
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
