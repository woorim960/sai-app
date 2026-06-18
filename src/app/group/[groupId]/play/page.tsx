import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { GroupPlayPage } from "@/components/group/group-play-page";
import { RouteFallback } from "@/components/layout/route-fallback";
import {
  getCardsByDeckIdCached,
  getDeckByIdCached,
} from "@/lib/api/cached-data";
import { getPlayAccessFallback } from "@/lib/deck-access";
import { CLIENT_ID_COOKIE, groupSessionCookieName } from "@/lib/cookies";
import { getGroupExpiredFallback } from "@/lib/group/group-access";
import { loadActiveGroup } from "@/lib/group/load-group-state";
import { resolvePlayBootstrap } from "@/lib/group/play-bootstrap";

type PageProps = {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<{ sid?: string; st?: string }>;
};

export default async function GroupPlayRoute({
  params,
  searchParams,
}: PageProps) {
  const { groupId } = await params;
  const query = await searchParams;
  const result = await loadActiveGroup(groupId);

  if (result.kind === "missing") notFound();
  if (result.kind === "expired") {
    return <RouteFallback {...getGroupExpiredFallback(result.deckId)} />;
  }

  const state = result.state;
  if (state.group.mode !== "async") notFound();

  const [deck, cards] = await Promise.all([
    getDeckByIdCached(state.group.deckId),
    getCardsByDeckIdCached(state.group.deckId),
  ]);

  if (!deck) notFound();

  if (cards.length === 0) {
    return (
      <RouteFallback {...getPlayAccessFallback("no_cards", deck)} />
    );
  }

  const cookieStore = await cookies();
  const bootstrap = resolvePlayBootstrap(groupId, state, cards.length, {
    clientId:
      cookieStore.get(CLIENT_ID_COOKIE)?.value ?? query.sid ?? null,
    sessionToken:
      cookieStore.get(groupSessionCookieName(groupId))?.value ?? query.st ?? null,
  });

  if (bootstrap?.completed) {
    redirect(`/group/${groupId}/result`);
  }

  return (
    <GroupPlayPage
      groupId={groupId}
      deck={deck}
      cards={cards}
      resultPath={`/group/${groupId}/result`}
      initialState={state}
      bootstrap={bootstrap}
    />
  );
}
