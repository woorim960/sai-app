import { ArchiveScreen } from "@/components/archive/archive-screen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "보관함",
  description: "좋아요한 덱과 플레이 기록을 확인하세요.",
};

export default function ArchivePage() {
  return <ArchiveScreen />;
}
