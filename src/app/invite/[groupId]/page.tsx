import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { JoinScreen } from "@/components/group/join-screen";
import { RouteFallback } from "@/components/layout/route-fallback";
import { getRepository } from "@/lib/api";
import { getGroupExpiredFallback } from "@/lib/group/group-access";
import { loadActiveGroup } from "@/lib/group/load-group-state";
import { buildGroupInviteMetadata } from "@/lib/page-metadata";

type PageProps = {
  params: Promise<{ groupId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { groupId } = await params;
  const result = await loadActiveGroup(groupId);
  if (result.kind !== "ok") return { title: "초대 | 사이" };

  const deck = await getRepository().getDeckById(result.state.group.deckId);
  if (!deck) return { title: "초대 | 사이" };

  return buildGroupInviteMetadata(deck);
}

export default async function InvitePage({ params }: PageProps) {
  const { groupId } = await params;
  const result = await loadActiveGroup(groupId);

  if (result.kind === "missing") notFound();
  if (result.kind === "expired") {
    return <RouteFallback {...getGroupExpiredFallback(result.deckId)} />;
  }

  const state = result.state;
  const deck = await getRepository().getDeckById(state.group.deckId);
  if (!deck) notFound();

  const isAsync = state.group.mode === "async";
  const resultPath = isAsync
    ? `/group/${groupId}/result`
    : `/room/${groupId}/result`;
  const playPath = isAsync
    ? `/group/${groupId}/play`
    : `/room/${groupId}/play`;

  return (
    <JoinScreen
      groupId={groupId}
      deck={deck}
      initialState={state}
      playPath={playPath}
      resultPath={resultPath}
      lobbyPath={`/room/${groupId}`}
    />
  );
}
