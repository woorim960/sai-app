import { getCoupleRepository } from "@/lib/couple/index";
import { toPublicCoupleState } from "@/lib/couple/helpers";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    clientId?: string;
    displayName?: string;
    emoji?: string;
    coupleName?: string;
    anniversary?: string;
  };

  if (!body.clientId || !body.displayName) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { state, token } = await getCoupleRepository().createCouple({
    clientId: body.clientId,
    displayName: body.displayName,
    emoji: body.emoji,
    coupleName: body.coupleName,
    anniversary: body.anniversary,
  });

  return Response.json({ ...toPublicCoupleState(state), sessionToken: token });
}
