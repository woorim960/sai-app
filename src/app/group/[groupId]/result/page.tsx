import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GroupResultPage } from "@/components/group/group-result-page";
import { RouteFallback } from "@/components/layout/route-fallback";
import {
  getPlayCardsByDeckId,
  getPlayDeckById,
} from "@/lib/data/play-content";
import { getGroupExpiredFallback } from "@/lib/group/group-access";
import { loadActiveGroup } from "@/lib/group/load-group-state";
import { buildGroupResultMetadata } from "@/lib/page-metadata";

type PageProps = {
  params: Promise<{ groupId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { groupId } = await params;
  const result = await loadActiveGroup(groupId);
  if (result.kind !== "ok") return { title: "결과 | 사이" };

  const deck = getPlayDeckById(result.state.group.deckId);
  if (!deck) return { title: "결과 | 사이" };

  return buildGroupResultMetadata(deck);
}

export default async function GroupResultRoute({ params }: PageProps) {
  const { groupId } = await params;
  const result = await loadActiveGroup(groupId);

  if (result.kind === "missing") notFound();
  if (result.kind === "expired") {
    return <RouteFallback {...getGroupExpiredFallback(result.deckId)} />;
  }

  const state = result.state;
  if (state.group.mode !== "async") notFound();

  const deck = getPlayDeckById(state.group.deckId);
  const cards = getPlayCardsByDeckId(state.group.deckId);

  if (!deck) notFound();

  return (
    <GroupResultPage
      groupId={groupId}
      deck={deck}
      cards={cards}
      initialState={state}
    />
  );
}
