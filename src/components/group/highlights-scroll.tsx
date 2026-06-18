import { Sparkles } from "lucide-react";
import type { InsightHighlight } from "@/lib/group/insight-highlights";
import { HighlightScrollCard } from "@/components/group/highlight-scroll-card";
import { ResultHorizontalScroll, ResultScrollItem } from "@/components/group/result-ui/result-horizontal-scroll";
import { ResultSectionHeader } from "@/components/group/result-ui/result-section-header";

type HighlightsScrollProps = {
  highlights: InsightHighlight[];
  className?: string;
};

export function HighlightsScroll({ highlights, className }: HighlightsScrollProps) {
  if (highlights.length === 0) return null;

  return (
    <section
      className={className}
      aria-label="하이라이트"
    >
      <div className="rounded-[24px] bg-gradient-to-b from-[#FAF8FF] to-transparent pb-1 pt-3">
        <ResultSectionHeader
          icon={<Sparkles className="size-3.5" strokeWidth={2.5} />}
          title="하이라이트"
          description="재미있었던 순간을 카드로 모았어요 · 옆으로 넘겨보세요"
          count={highlights.length}
        />
        <ResultHorizontalScroll>
          {highlights.map((highlight) => (
            <ResultScrollItem key={highlight.id}>
              <HighlightScrollCard highlight={highlight} />
            </ResultScrollItem>
          ))}
        </ResultHorizontalScroll>
      </div>
    </section>
  );
}
