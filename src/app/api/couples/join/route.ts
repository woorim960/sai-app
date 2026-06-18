import { getCoupleRepository } from "@/lib/couple/index";
import { toPublicCoupleState } from "@/lib/couple/helpers";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    inviteCode?: string;
    clientId?: string;
    displayName?: string;
    emoji?: string;
  };

  if (!body.inviteCode || !body.clientId || !body.displayName) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await getCoupleRepository().joinCouple({
    inviteCode: body.inviteCode,
    clientId: body.clientId,
    displayName: body.displayName,
    emoji: body.emoji,
  });

  if (!result.ok) {
    if (result.reason === "not_found") {
      return Response.json({ error: "Invite not found" }, { status: 404 });
    }
    return Response.json({ error: "Couple is full" }, { status: 409 });
  }

  return Response.json({
    ...toPublicCoupleState(result.state),
    sessionToken: result.token,
  });
}
