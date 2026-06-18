import { DeckListScreen } from "@/components/deck/deck-list-screen";
import { getRepository } from "@/lib/api";
import { buildSituationMetadata } from "@/lib/page-metadata";
import { getAllSituations } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ situationId: string }>;
};

export function generateStaticParams() {
  return getAllSituations().map((situation) => ({
    situationId: situation.id,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { situationId } = await params;
  const situation = await getRepository().getSituationById(situationId);
  if (!situation) return { title: "상황을 찾을 수 없어요" };
  return buildSituationMetadata(situation);
}

export default async function SituationPage({ params }: PageProps) {
  const { situationId } = await params;
  const repo = getRepository();
  const situation = await repo.getSituationById(situationId);

  if (!situation) {
    notFound();
  }

  const situationDecks = await repo.getDecksBySituationId(situationId);

  return <DeckListScreen situation={situation} decks={situationDecks} />;
}
