import { requireCoupleMember } from "@/lib/couple/api-auth";
import { getCoupleRepository } from "@/lib/couple/index";
import { toPublicCoupleState } from "@/lib/couple/helpers";
import type { CoupleRecordMode } from "@/lib/couple/types";

type RouteContext = { params: Promise<{ coupleId: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { coupleId } = await context.params;
  const auth = await requireCoupleMember(request, coupleId);

  if (!auth.ok) {
    return Response.json({ error: "Unauthorized" }, { status: auth.status });
  }

  const body = (await request.json()) as {
    deckId?: string;
    deckTitle?: string;
    mode?: CoupleRecordMode;
    minutes?: number;
    score?: number;
    note?: string;
  };

  if (!body.deckId || !body.deckTitle || !body.mode) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const state = await getCoupleRepository().addCoupleRecord({
    coupleId,
    clientId: auth.clientId,
    deckId: body.deckId,
    deckTitle: body.deckTitle,
    mode: body.mode,
    minutes: typeof body.minutes === "number" ? body.minutes : 0,
    score: body.score,
    note: body.note,
  });

  if (!state) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(toPublicCoupleState(state));
}
