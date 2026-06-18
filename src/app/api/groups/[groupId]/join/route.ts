import { groupErrorResponse, groupJsonResponse } from "@/lib/group/api-response";
import { getGroupRepository } from "@/lib/group/index";
import { createGroupSessionToken } from "@/lib/group/session";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { groupId } = await context.params;
  const body = (await request.json()) as {
    clientId?: string;
    displayName?: string;
  };

  if (!body.clientId || !body.displayName) {
    return groupErrorResponse("Invalid request", 400);
  }

  const repo = getGroupRepository();
  const state = await repo.joinGroup({
    groupId,
    clientId: body.clientId,
    displayName: body.displayName,
  });

  if (!state) {
    return groupErrorResponse("Cannot join group", 404);
  }

  const sessionToken = createGroupSessionToken(groupId, body.clientId);

  return groupJsonResponse({ ...state, sessionToken });
}
