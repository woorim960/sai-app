import { ConnectScreen } from "@/components/together/connect-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커플 연결",
  description: "파트너와 연결하고 둘의 기록을 함께 쌓아보세요.",
};

export default function TogetherConnectPage() {
  return <ConnectScreen />;
}
