import type { Metadata } from "next";
import { BrowseScreen } from "@/components/browse/browse-screen";
import { getRepository } from "@/lib/api";

export const metadata: Metadata = {
  title: "둘러보기",
  description: "상황별 덱과 인기 게임을 탐색하세요.",
};

export default async function BrowsePage() {
  const repo = getRepository();
  const [situations, popularDecks] = await Promise.all([
    repo.getSituations(),
    repo.getPopularDecks(),
  ]);

  return <BrowseScreen situations={situations} popularDecks={popularDecks} />;
}
