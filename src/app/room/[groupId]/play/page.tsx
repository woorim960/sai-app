import { notFound, redirect } from "next/navigation";
import { SyncPlayPage } from "@/components/group/sync-play-page";
import { RouteFallback } from "@/components/layout/route-fallback";
import { getRepository } from "@/lib/api";
import { getGroupExpiredFallback } from "@/lib/group/group-access";
import { loadActiveGroup } from "@/lib/group/load-group-state";

type PageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function RoomPlayPage({ params }: PageProps) {
  const { groupId } = await params;
  const result = await loadActiveGroup(groupId);

  if (result.kind === "missing") notFound();
  if (result.kind === "expired") {
    return <RouteFallback {...getGroupExpiredFallback(result.deckId)} />;
  }

  const state = result.state;
  if (state.group.mode !== "sync") notFound();

  if (state.group.status === "waiting") {
    redirect(`/room/${groupId}`);
  }

  if (state.group.status === "finished") {
    redirect(`/room/${groupId}/result`);
  }

  const deck = await getRepository().getDeckById(state.group.deckId);
  const cards = await getRepository().getCardsByDeckId(state.group.deckId);

  if (!deck) notFound();

  return (
    <SyncPlayPage
      groupId={groupId}
      deck={deck}
      cards={cards}
      initialState={state}
    />
  );
}
