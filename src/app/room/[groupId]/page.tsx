import { notFound } from "next/navigation";
import { RoomLobbyScreen } from "@/components/group/room-lobby-screen";
import { RouteFallback } from "@/components/layout/route-fallback";
import { getDeckByIdCached } from "@/lib/api/cached-data";
import { getGroupExpiredFallback } from "@/lib/group/group-access";
import { loadActiveGroup } from "@/lib/group/load-group-state";

type PageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function RoomPage({ params }: PageProps) {
  const { groupId } = await params;
  const result = await loadActiveGroup(groupId);

  if (result.kind === "missing") notFound();
  if (result.kind === "expired") {
    return <RouteFallback {...getGroupExpiredFallback(result.deckId)} />;
  }

  const state = result.state;
  if (state.group.mode !== "sync") notFound();

  const deck = await getDeckByIdCached(state.group.deckId);
  if (!deck) notFound();

  return (
    <RoomLobbyScreen groupId={groupId} deck={deck} initialState={state} />
  );
}
