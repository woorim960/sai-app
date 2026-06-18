import { redirect } from "next/navigation";
import { getRepository } from "@/lib/api";

type PageProps = {
  params: Promise<{ deckId: string }>;
};

export default async function LegacyResultRedirect({ params }: PageProps) {
  const { deckId } = await params;
  const deck = await getRepository().getDeckById(deckId);

  if (!deck) {
    redirect("/home");
  }

  redirect(`/decks/${deckId}`);
}
