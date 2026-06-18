import { GroupPlayClientEntry } from "@/components/group/group-play-client-entry";

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

  return (
    <GroupPlayClientEntry groupId={groupId} sid={query.sid} st={query.st} />
  );
}
