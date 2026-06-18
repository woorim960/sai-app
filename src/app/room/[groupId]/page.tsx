import { RoomLobbyClientEntry } from "@/components/group/room-lobby-client-entry";

type PageProps = {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<{ sid?: string; st?: string }>;
};

export default async function RoomPage({
  params,
  searchParams,
}: PageProps) {
  const { groupId } = await params;
  const query = await searchParams;

  return (
    <RoomLobbyClientEntry groupId={groupId} sid={query.sid} st={query.st} />
  );
}
