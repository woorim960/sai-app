import { TogetherScreen } from "@/components/together/together-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "둘이하기",
  description: "둘이서 함께할 수 있는 게임을 골라보세요.",
};

export default function TogetherPage() {
  return <TogetherScreen />;
}
