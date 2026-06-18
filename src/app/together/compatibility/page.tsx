import { CompatibilityScreen } from "@/components/together/compatibility-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "연애 궁합 심리테스트",
  description: "나의 연애 스타일과 둘의 궁합 점수를 확인해보세요.",
};

export default function CompatibilityPage() {
  return <CompatibilityScreen />;
}
