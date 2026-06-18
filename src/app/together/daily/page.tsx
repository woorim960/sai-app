import { DailyScreen } from "@/components/together/daily-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오늘의 질문",
  description: "매일 하나씩, 서로를 더 알아가는 질문에 답해보세요.",
};

export default function DailyPage() {
  return <DailyScreen />;
}
