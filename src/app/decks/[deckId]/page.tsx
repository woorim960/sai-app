import { DeckDetailScreen } from "@/components/deck/deck-detail-screen";
import { getDeckByIdCached } from "@/lib/api/cached-data";
import { buildDeckMetadata } from "@/lib/page-metadata";
import { decks } from "@/lib/data";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ deckId: string }>;
};

export function generateStaticParams() {
  return decks.map((deck) => ({
    deckId: deck.id,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { deckId } = await params;
  const deck = await getDeckByIdCached(deckId);
  if (!deck) return { title: "덱을 찾을 수 없어요" };
  return buildDeckMetadata(deck);
}

export default async function DeckPage({ params }: PageProps) {
  const { deckId } = await params;
  const deck = await getDeckByIdCached(deckId);

  if (!deck) {
    notFound();
  }

  return (
    <DeckDetailScreen
      deck={deck}
      backHref={`/situations/${deck.situationId}`}
    />
  );
}
