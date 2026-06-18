import type { MyBalanceResult } from "@/lib/group/result-helpers";
import { ResultHorizontalScroll, ResultScrollItem } from "@/components/group/result-ui/result-horizontal-scroll";
import { RESULT_CARD_HEIGHT_PX } from "@/components/group/result-ui/constants";

type MyResultSummaryProps = {
  results: MyBalanceResult[];
};

export function MyResultSummary({ results }: MyResultSummaryProps) {
  if (results.length === 0) {
    return (
      <p className="text-[14px] text-sai-text-secondary">
        Balance 선택 기록이 없어요.
      </p>
    );
  }

  return (
    <ResultHorizontalScroll>
      {results.map(({ card, label }, index) => (
        <ResultScrollItem key={card.id}>
          <article
            className="flex h-full flex-col rounded-[20px] border border-border/60 bg-sai-surface p-4 shadow-[0_2px_16px_rgba(30,30,30,0.04)]"
            style={{ height: RESULT_CARD_HEIGHT_PX }}
          >
            <p className="text-[11px] font-semibold text-sai-primary">
              내 선택 · {index + 1}
            </p>
            <p className="mt-2 text-[14px] font-bold leading-snug text-sai-text">
              {card.optionA}
            </p>
            <p className="text-center text-[11px] font-bold text-sai-text-secondary">
              VS
            </p>
            <p className="text-[14px] font-bold leading-snug text-sai-text">
              {card.optionB}
            </p>
            <div className="mt-auto rounded-[12px] bg-accent px-3 py-3 text-center">
              <p className="text-[10px] text-sai-text-secondary">내가 고른 답</p>
              <p className="mt-1 text-[15px] font-bold text-sai-primary">{label}</p>
            </div>
          </article>
        </ResultScrollItem>
      ))}
    </ResultHorizontalScroll>
  );
}
