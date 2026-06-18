import { HomeScreen } from "@/components/home/home-screen";
import { HOME_CONTEXTS } from "@/lib/data/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "홈",
  description: "오늘 함께할 사람과 상황을 선택하세요.",
};

type HomePageProps = {
  searchParams: Promise<{ context?: string }>;
};

function resolveContextId(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  return HOME_CONTEXTS.some((item) => item.id === raw) ? raw : undefined;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { context } = await searchParams;
  return <HomeScreen initialContextId={resolveContextId(context)} />;
}
