"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_QUESTION_ANSWER_LENGTH } from "@/lib/group/sync-card-progress";
import { cn } from "@/lib/utils";

type SyncQuestionAnswerFormProps = {
  cardId: string;
  initialText?: string;
  submittedText?: string;
  isSubmitting: boolean;
  isCompleted: boolean;
  onSubmit: (text: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
  className?: string;
};

function SyncQuestionAnswerFormInner({
  cardId,
  initialText = "",
  submittedText = "",
  isSubmitting,
  isCompleted,
  onSubmit,
  onTypingChange,
  className,
}: SyncQuestionAnswerFormProps) {
  const [draft, setDraft] = useState(initialText);
  const prevCardIdRef = useRef(cardId);

  useEffect(() => {
    if (prevCardIdRef.current === cardId) return;
    prevCardIdRef.current = cardId;
    setDraft(initialText);
  }, [cardId, initialText]);

  const displayText = submittedText.trim() || draft.trim();

  if (isCompleted) {
    return (
      <section
        className={cn(
          "rounded-[20px] border border-[#D8F5E3] bg-gradient-to-br from-[#F4FFF8] to-white p-4 shadow-[0_2px_16px_rgba(52,199,89,0.08)]",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#34C759]/15 text-[#34C759]">
            <Check className="size-4" strokeWidth={2.8} />
          </span>
          <div>
            <p className="text-[14px] font-bold text-sai-text">답변 완료!</p>
            <p className="text-[12px] text-sai-text-secondary">
              다른 참여자를 기다리는 중이에요
            </p>
          </div>
        </div>
        {displayText && (
          <p className="mt-3 rounded-[14px] bg-white/80 px-3.5 py-3 text-[13px] leading-relaxed text-sai-text ring-1 ring-[#E8F8EE]">
            {displayText}
          </p>
        )}
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-[20px] border border-[#EEEDF4] bg-white p-4 shadow-[0_2px_16px_rgba(45,49,66,0.05)]",
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F0EDFF] text-sai-primary">
          <MessageCircle className="size-4" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold text-sai-text">
            생각이 떠오르면 적어보세요
          </p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-sai-text-secondary">
            입력은 선택이에요. 준비되면 아래 버튼을 눌러주세요
          </p>
        </div>
      </div>

      <textarea
        value={draft}
        onChange={(event) =>
          setDraft(event.target.value.slice(0, MAX_QUESTION_ANSWER_LENGTH))
        }
        onFocus={() => onTypingChange?.(true)}
        onBlur={() => onTypingChange?.(false)}
        placeholder="마음에 드는 대로 자유롭게 적어도 돼요"
        rows={3}
        className="mt-3 w-full resize-none rounded-[14px] border border-[#EEEDF4] bg-[#FAFAFC] px-3.5 py-3 text-[14px] leading-relaxed text-sai-text outline-none transition-shadow placeholder:text-sai-text-secondary/70 focus:border-sai-primary/35 focus:bg-white focus:shadow-[0_0_0_3px_rgba(133,118,255,0.12)]"
      />

      <div className="mt-2 flex items-center justify-between gap-3">
        <span className="text-[11px] text-sai-text-secondary">
          선택 사항 · 최대 {MAX_QUESTION_ANSWER_LENGTH}자
        </span>
        <span
          className={cn(
            "text-[11px] font-semibold tabular-nums",
            draft.length >= MAX_QUESTION_ANSWER_LENGTH
              ? "text-sai-primary"
              : "text-sai-text-secondary"
          )}
        >
          {draft.length}/{MAX_QUESTION_ANSWER_LENGTH}
        </span>
      </div>

      <Button
        onClick={() => onSubmit(draft.trim())}
        disabled={isSubmitting}
        className="sai-btn-dark mt-4 h-14 w-full disabled:opacity-40"
      >
        {isSubmitting ? "저장 중..." : "답변 완료"}
      </Button>
    </section>
  );
}

export const SyncQuestionAnswerForm = memo(SyncQuestionAnswerFormInner);
