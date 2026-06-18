import { GamesScreen } from "@/components/games/games-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "게임",
  description: "전체 덱을 둘러보고 함께 플레이하세요.",
};

type GamesPageProps = {
  searchParams: Promise<{
    filter?: string;
    context?: string;
  }>;
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const params = await searchParams;
  return (
    <GamesScreen initialFilter={params.filter} initialContext={params.context} />
  );
}
