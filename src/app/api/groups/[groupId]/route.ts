import { requireGroupSession } from "@/lib/group/api-auth";
import { groupErrorResponse, groupJsonResponse } from "@/lib/group/api-response";
import { getGroupRepository } from "@/lib/group/index";
import { resolveGroup } from "@/lib/group/load-group-state";
import { toGroupPublicPreview } from "@/lib/group/public-preview";

type RouteContext = { params: Promise<{ groupId: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { groupId } = await context.params;
    const repo = getGroupRepository();
    const auth = await requireGroupSession(request, groupId, repo);

    if (auth.ok) {
      return groupJsonResponse(auth.state);
    }

    const result = await resolveGroup(groupId);
    if (result.status === "missing") {
      return groupErrorResponse("Not found", 404);
    }
    if (result.status === "expired") {
      return groupErrorResponse("Group expired", 410);
    }

    return groupJsonResponse(toGroupPublicPreview(result.state));
  } catch {
    return groupErrorResponse("Internal error", 500);
  }
}
