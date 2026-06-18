import { BarChart3 } from "lucide-react";
import type { CardSplitStat } from "@/lib/group/comparison-stats";
import { SplitScrollCard } from "@/components/group/split-scroll-card";
import { ResultHorizontalScroll, ResultScrollItem } from "@/components/group/result-ui/result-horizontal-scroll";
import { ResultSectionHeader } from "@/components/group/result-ui/result-section-header";

type SplitChartsScrollProps = {
  stats: CardSplitStat[];
  className?: string;
};

export function SplitChartsScroll({ stats, className }: SplitChartsScrollProps) {
  const chartable = stats.filter((s) => s.aCount + s.bCount >= 2);

  if (chartable.length === 0) {
    return (
      <p className="text-center text-[14px] text-sai-text-secondary">
        2명 이상 완료하면 선택 분포를 볼 수 있어요.
      </p>
    );
  }

  return (
    <section
      className={className}
      aria-label="선택 분포"
    >
      <div className="rounded-[24px] bg-gradient-to-b from-[#F5F8FF] to-transparent pb-1 pt-3">
        <ResultSectionHeader
          icon={<BarChart3 className="size-3.5" strokeWidth={2.5} />}
          title="선택 분포"
          description="질문별로 누가 어떤 답을 골랐는지 확인해요"
          count={chartable.length}
        />
        <ResultHorizontalScroll>
          {chartable.map((stat, index) => (
            <ResultScrollItem key={stat.card.id}>
              <SplitScrollCard stat={stat} index={index} />
            </ResultScrollItem>
          ))}
        </ResultHorizontalScroll>
      </div>
    </section>
  );
}
