"use client";

import { useHomeExperimentMetrics } from "@/lib/hooks/use-home-experiment-metrics";

function toPercent(clicks: number, views: number): string {
  if (views <= 0) return "0.0%";
  return `${((clicks / views) * 100).toFixed(1)}%`;
}

function VariantRow({
  label,
  views,
  featuredClicks,
  popularClicks,
  quickThemeClicks,
  deckDetailViews,
  asyncStarts,
  syncStarts,
}: {
  label: string;
  views: number;
  featuredClicks: number;
  popularClicks: number;
  quickThemeClicks: number;
  deckDetailViews: number;
  asyncStarts: number;
  syncStarts: number;
}) {
  const homeDeckClicks = featuredClicks + popularClicks;
  const totalStarts = asyncStarts + syncStarts;

  return (
    <div className="rounded-[12px] bg-[#F7F7FB] p-3">
      <p className="text-[12px] font-bold text-sai-text">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-sai-text-secondary">
        <span>홈 노출 {views}</span>
        <span>추천 클릭 {featuredClicks}</span>
        <span>추천 CTR {toPercent(featuredClicks, views)}</span>
        <span>인기 클릭 {popularClicks}</span>
        <span>인기 CTR {toPercent(popularClicks, views)}</span>
        <span>테마 클릭 {quickThemeClicks}</span>
        <span>홈→상세 {deckDetailViews}</span>
        <span>홈→상세 CVR {toPercent(deckDetailViews, homeDeckClicks)}</span>
        <span>상세→시작 {totalStarts}</span>
        <span>상세→시작 CVR {toPercent(totalStarts, deckDetailViews)}</span>
        <span>각자하기 시작 {asyncStarts}</span>
        <span>함께하기 시작 {syncStarts}</span>
      </div>
    </div>
  );
}

export function HomeExperimentReport() {
  const metrics = useHomeExperimentMetrics();

  return (
    <details className="overflow-hidden rounded-[14px] border border-[#ECECF0] bg-white">
      <summary className="cursor-pointer px-4 py-3 text-[12px] font-semibold text-sai-text-secondary">
        홈 A/B 성과 보기
      </summary>
      <div className="space-y-2 border-t border-[#F0F0F4] p-3">
        <VariantRow label="A안" {...metrics.A} />
        <VariantRow label="B안" {...metrics.B} />
      </div>
    </details>
  );
}
