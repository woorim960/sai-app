"use client";

import { MessageCircle } from "lucide-react";
import { MAX_QUESTION_ANSWER_LENGTH } from "@/lib/group/sync-card-progress";
import { cn } from "@/lib/utils";

type QuestionAnswerInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function QuestionAnswerInput({
  value,
  onChange,
  className,
}: QuestionAnswerInputProps) {
  return (
    <section
      className={cn(
        "rounded-[22px] border border-[#EEEDF4] bg-white p-4 shadow-[0_4px_24px_rgba(45,49,66,0.06)]",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F0EDFF] to-[#FAF8FF] text-sai-primary">
          <MessageCircle className="size-4" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold text-sai-text">
            생각나는 대로 적어보세요
          </p>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-sai-text-secondary">
            입력은 선택이에요. 적지 않아도 다음으로 넘어갈 수 있어요
          </p>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value.slice(0, MAX_QUESTION_ANSWER_LENGTH))
        }
        placeholder="솔직한 한마디, 떠오르는 기억, 지금의 마음…"
        rows={4}
        className="mt-3.5 w-full resize-none rounded-[16px] border border-[#EEEDF4] bg-[#FAFAFC] px-4 py-3.5 text-[15px] leading-relaxed text-sai-text outline-none transition-all placeholder:text-sai-text-secondary/60 focus:border-sai-primary/40 focus:bg-white focus:shadow-[0_0_0_4px_rgba(133,118,255,0.1)]"
      />

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-sai-text-secondary">선택 입력</span>
        <span
          className={cn(
            "text-[11px] font-semibold tabular-nums",
            value.length >= MAX_QUESTION_ANSWER_LENGTH
              ? "text-sai-primary"
              : "text-sai-text-secondary"
          )}
        >
          {value.length}/{MAX_QUESTION_ANSWER_LENGTH}
        </span>
      </div>
    </section>
  );
}
