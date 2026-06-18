import { MyScreen } from "@/components/my/my-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이",
  description: "프로필과 활동 정보를 확인하세요.",
};

export default function MyPage() {
  return <MyScreen />;
}
