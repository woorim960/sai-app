import { requireCoupleMember } from "@/lib/couple/api-auth";
import { getCoupleRepository } from "@/lib/couple/index";
import { toPublicCoupleState } from "@/lib/couple/helpers";

type RouteContext = { params: Promise<{ coupleId: string }> };

export async function GET(request: Request, context: RouteContext) {
  const { coupleId } = await context.params;
  const auth = await requireCoupleMember(request, coupleId);

  if (!auth.ok) {
    return Response.json({ error: "Unauthorized" }, { status: auth.status });
  }

  return Response.json(toPublicCoupleState(auth.state));
}

export async function PATCH(request: Request, context: RouteContext) {
  const { coupleId } = await context.params;
  const auth = await requireCoupleMember(request, coupleId);

  if (!auth.ok) {
    return Response.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const body = (await request.json()) as {
    coupleName?: string;
    anniversary?: string;
  };

  const state = await getCoupleRepository().updateCoupleProfile(coupleId, {
    coupleName: body.coupleName,
    anniversary: body.anniversary,
  });

  if (!state) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(toPublicCoupleState(state));
}
