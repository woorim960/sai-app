import { requireHostSession } from "@/lib/group/api-auth";
import { groupErrorResponse, groupJsonResponse } from "@/lib/group/api-response";
import { getGroupRepository } from "@/lib/group/index";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { groupId } = await context.params;
  const body = (await request.json()) as { clientId?: string };

  if (!body.clientId) {
    return groupErrorResponse("Invalid request", 400);
  }

  const repo = getGroupRepository();
  const auth = await requireHostSession(request, groupId, repo);
  if (!auth.ok) {
    return groupErrorResponse(auth.error, auth.status);
  }

  if (auth.state.participants.length < 2) {
    return groupErrorResponse("친구가 입장해야 시작할 수 있어요", 409);
  }

  const state = await repo.startSyncGroup(groupId, body.clientId);

  if (!state) {
    return groupErrorResponse("Not found", 404);
  }

  return groupJsonResponse(state);
}
