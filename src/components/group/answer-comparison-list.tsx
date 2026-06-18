import type { CardComparison } from "@/lib/group/result-helpers";

type AnswerComparisonListProps = {
  comparisons: CardComparison[];
};

export function AnswerComparisonList({ comparisons }: AnswerComparisonListProps) {
  if (comparisons.length === 0) {
    return (
      <p className="text-center text-[14px] text-sai-text-secondary">
        아직 비교할 선택이 없어요.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comparisons.map(({ card, entries }, index) => (
        <div
          key={card.id}
          className="rounded-[20px] bg-sai-surface p-5 shadow-[0_2px_24px_rgba(30,30,30,0.04)]"
        >
          <p className="text-[12px] font-medium text-sai-primary">
            {index + 1} · Balance
          </p>
          <p className="mt-2 text-[16px] font-semibold text-sai-text">
            {card.optionA} VS {card.optionB}
          </p>
          <ul className="mt-4 space-y-2">
            {entries.map(({ participant, answer }) => (
              <li
                key={participant.clientId}
                className="flex items-center justify-between text-[14px]"
              >
                <span className="text-sai-text-secondary">
                  {participant.displayName}
                  {participant.status !== "completed" && (
                    <span className="ml-1 text-[12px]">(진행 중)</span>
                  )}
                </span>
                <span className="font-medium text-sai-text">
                  {answer?.selectedLabel ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
