import { cn } from "@/lib/utils";
import type { CardSplitStat } from "@/lib/group/comparison-stats";

type CardSplitChartsProps = {
  stats: CardSplitStat[];
  className?: string;
};

export function CardSplitCharts({ stats, className }: CardSplitChartsProps) {
  const chartable = stats.filter((s) => s.aCount + s.bCount >= 2);

  if (chartable.length === 0) {
    return (
      <p className="text-center text-[14px] text-sai-text-secondary">
        2명 이상 완료하면 선택 분포를 볼 수 있어요.
      </p>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {chartable.map((stat, index) => (
        <div
          key={stat.card.id}
          className={cn(
            "rounded-[20px] bg-sai-surface p-5 shadow-[0_2px_24px_rgba(30,30,30,0.04)]",
            stat.isMostSplit && "ring-1 ring-sai-primary/30"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[12px] font-medium text-sai-primary">
                {index + 1} · Balance
              </p>
              <p className="mt-1 text-[15px] font-semibold text-sai-text">
                {stat.card.optionA} VS {stat.card.optionB}
              </p>
            </div>
            {stat.isUnanimous && (
              <span className="shrink-0 rounded-full bg-[#E8F8F0] px-2.5 py-1 text-[11px] font-medium text-[#2A9D6A]">
                만장일치
              </span>
            )}
            {stat.isMostSplit && !stat.isUnanimous && (
              <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-sai-primary">
                가장 갈림
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="flex h-4 overflow-hidden rounded-full">
              <div
                className="flex items-center justify-center bg-sai-primary text-[10px] font-medium text-white transition-all duration-500"
                style={{ width: `${Math.max(stat.aPercent, stat.aCount > 0 ? 12 : 0)}%` }}
              >
                {stat.aPercent > 15 ? `${stat.aPercent}%` : ""}
              </div>
              <div
                className="flex items-center justify-center bg-[#C4BBFF] text-[10px] font-medium text-sai-text transition-all duration-500"
                style={{ width: `${Math.max(stat.bPercent, stat.bCount > 0 ? 12 : 0)}%` }}
              >
                {stat.bPercent > 15 ? `${stat.bPercent}%` : ""}
              </div>
            </div>
            <div className="mt-2 flex justify-between text-[12px]">
              <span className="font-medium text-sai-primary">
                A · {stat.card.optionA} ({stat.aCount}명)
              </span>
              <span className="font-medium text-sai-text">
                B · {stat.card.optionB} ({stat.bCount}명)
              </span>
            </div>
          </div>

          <ul className="mt-4 space-y-1.5 border-t border-border pt-3">
            {stat.entries.map((entry) => (
              <li
                key={entry.displayName}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="text-sai-text-secondary">
                  {entry.displayName}
                  {!entry.completed && (
                    <span className="ml-1 text-[11px]">(진행 중)</span>
                  )}
                </span>
                <span
                  className={cn(
                    "font-medium",
                    entry.option === "A"
                      ? "text-sai-primary"
                      : entry.option === "B"
                        ? "text-sai-text"
                        : "text-sai-text-secondary"
                  )}
                >
                  {entry.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
