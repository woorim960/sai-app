import { cn } from "@/lib/utils";
import type { CardSplitStat } from "@/lib/group/comparison-stats";
import { ResultCardShell } from "@/components/group/result-ui/result-card-shell";

type SplitScrollCardProps = {
  stat: CardSplitStat;
  index: number;
};

export function SplitScrollCard({ stat, index }: SplitScrollCardProps) {
  const badge = stat.isUnanimous
    ? "만장일치"
    : stat.isMostSplit
      ? "가장 갈림"
      : "선택 분포";

  const badgeClass = stat.isUnanimous
    ? "bg-[#D4F5E4] text-[#2A9D6A]"
    : stat.isMostSplit
      ? "bg-[#FFE8E0] text-[#E07A5F]"
      : "bg-[#F0EDFF] text-sai-primary";

  return (
    <ResultCardShell
      badge={badge}
      badgeClassName={badgeClass}
      title={`${stat.card.optionA} VS ${stat.card.optionB}`}
      subtitle={`Q${index + 1} · ${stat.aCount + stat.bCount}명 응답`}
      className={cn(
        stat.isMostSplit && "ring-1 ring-[#E07A5F]/15",
        stat.isUnanimous && "ring-1 ring-[#2A9D6A]/15"
      )}
    >
      <div className="space-y-4">
        <div className="flex h-6 overflow-hidden rounded-full bg-[#F0EDFF]">
          <div
            className="flex items-center justify-center bg-gradient-to-r from-sai-primary to-[#A89EFF] text-[10px] font-bold text-white transition-all"
            style={{
              width: `${Math.max(stat.aPercent, stat.aCount > 0 ? 14 : 0)}%`,
            }}
          >
            {stat.aPercent >= 18 ? `${stat.aPercent}%` : ""}
          </div>
          <div
            className="flex items-center justify-center bg-gradient-to-r from-[#C4BBFF] to-[#E8E4FF] text-[10px] font-bold text-sai-text"
            style={{
              width: `${Math.max(stat.bPercent, stat.bCount > 0 ? 14 : 0)}%`,
            }}
          >
            {stat.bPercent >= 18 ? `${stat.bPercent}%` : ""}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-[11px]">
          <div className="rounded-[14px] border border-[#EDE9FB] bg-gradient-to-b from-[#FAF8FF] to-white px-3 py-2.5">
            <p className="font-bold text-sai-primary">A · {stat.aCount}명</p>
            <p className="mt-1 leading-snug text-sai-text">{stat.card.optionA}</p>
          </div>
          <div className="rounded-[14px] border border-[#EDE9FB] bg-gradient-to-b from-[#F7F5FF] to-white px-3 py-2.5">
            <p className="font-bold text-[#7A6FE0]">B · {stat.bCount}명</p>
            <p className="mt-1 leading-snug text-sai-text">{stat.card.optionB}</p>
          </div>
        </div>

        <ul className="space-y-1.5 rounded-[14px] bg-[#FAF8FF] p-2">
          {stat.entries.map((entry) => (
            <li
              key={entry.displayName}
              className="flex items-center justify-between gap-2 rounded-[10px] bg-white px-2.5 py-2 text-[11px]"
            >
              <span className="font-medium text-sai-text-secondary">
                {entry.displayName}
                {!entry.completed && (
                  <span className="ml-1 text-[10px] text-sai-text-secondary/70">
                    (진행 중)
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                  entry.option === "A"
                    ? "bg-[#F0EDFF] text-sai-primary"
                    : entry.option === "B"
                      ? "bg-[#EDE9FF] text-[#7A6FE0]"
                      : "text-sai-text-secondary"
                )}
              >
                {entry.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ResultCardShell>
  );
}
