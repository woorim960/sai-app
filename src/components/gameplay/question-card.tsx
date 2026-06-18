import { MessageCircleHeart } from "lucide-react";
import type { Card } from "@/lib/data";
import { PHASE_LABELS } from "@/lib/data";
import { BalanceOptions } from "./balance-options";
import { cn } from "@/lib/utils";

type QuestionCardProps = {
  card: Card;
  selectedOption: "A" | "B" | null;
  onSelectOption: (option: "A" | "B") => void;
  className?: string;
};

export function QuestionCard({
  card,
  selectedOption,
  onSelectOption,
  className,
}: QuestionCardProps) {
  const isBalance = card.type === "balance";

  if (isBalance && card.optionA && card.optionB) {
    return (
      <div className={cn("flex flex-col", className)}>
        <div className="flex justify-center">
          <span className="sai-chip bg-accent font-semibold text-sai-primary">
            {PHASE_LABELS[card.phase]}
          </span>
        </div>

        <BalanceOptions
          optionA={card.optionA}
          optionB={card.optionB}
          selected={selectedOption}
          onSelect={onSelectOption}
          name={`balance-${card.id}`}
          className="mt-6"
        />

        <div className="mt-6 flex items-start gap-2 rounded-[18px] bg-white/70 px-4 py-3.5 ring-1 ring-[#EEEDF4]">
          <MessageCircleHeart
            className="mt-0.5 size-4 shrink-0 text-sai-primary"
            strokeWidth={2}
          />
          <p className="text-[13.5px] leading-relaxed text-sai-text-secondary">
            {selectedOption
              ? card.helperText
              : "마음이 더 가는 쪽을 골라보세요"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "sai-card flex min-h-[360px] flex-col items-center justify-center px-5 py-8 text-center",
        className
      )}
    >
      <span className="mb-4 sai-chip bg-accent font-semibold text-sai-primary">
        {PHASE_LABELS[card.phase]}
      </span>
      <p className="text-[13px] font-semibold text-sai-primary">Q.</p>
      <h2 className="mt-2 text-[22px] font-bold leading-[1.4] tracking-[-0.02em] text-sai-text">
        {card.question}
      </h2>
      <p className="mt-8 w-full rounded-[16px] bg-sai-bg px-4 py-3 text-[14px] leading-relaxed text-sai-text-secondary">
        {card.helperText}
      </p>
    </div>
  );
}
