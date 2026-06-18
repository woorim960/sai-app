"use client";

import { Heart, Sparkles } from "lucide-react";
import type {
  CompatQuestion,
  CompatSectionId,
} from "@/lib/together/compatibility-questions";
import { cn } from "@/lib/utils";

type SectionProgress = {
  sectionIndex: number;
  sectionTotal: number;
  section: {
    id: CompatSectionId;
    title: string;
    subtitle: string;
  };
};

const SECTION_UI: Record<
  CompatSectionId,
  { emoji: string; hint: string; accent: string }
> = {
  attachment: {
    emoji: "💜",
    hint: "연인과 함께할 때를 떠올려보세요",
    accent: "from-[#FFE4EE] to-[#FFF5F8]",
  },
  expression: {
    emoji: "💬",
    hint: "평소 사랑을 표현하는 방식을 생각해보세요",
    accent: "from-[#FFF0F5] to-[#FFF8FB]",
  },
  lifestyle: {
    emoji: "🌿",
    hint: "둘만의 일상 리듬을 떠올려보세요",
    accent: "from-[#F0FFF4] to-[#F8FFFA]",
  },
  intimacy: {
    emoji: "🤝",
    hint: "마음을 나누는 순간을 떠올려보세요",
    accent: "from-[#F4F1FE] to-[#FAF8FF]",
  },
  passion: {
    emoji: "💕",
    hint: "설레고 두근거리는 순간을 떠올려보세요",
    accent: "from-[#FFE8F0] to-[#FFF5F9]",
  },
  commitment: {
    emoji: "🌙",
    hint: "앞으로의 관계를 상상해보세요",
    accent: "from-[#F0EDFF] to-[#F8F6FF]",
  },
  conflict: {
    emoji: "🕊️",
    hint: "다투고 나서 어떻게 푸는지 떠올려보세요",
    accent: "from-[#FFF8F0] to-[#FFFBF5]",
  },
  autonomy: {
    emoji: "☁️",
    hint: "나만의 시간과 공간을 생각해보세요",
    accent: "from-[#F0F8FF] to-[#F8FBFF]",
  },
};

const ENCOURAGEMENTS = [
  "정답은 없어요. 지금의 나를 떠올려보세요",
  "솔직하게 답해도 괜찮아요",
  "천천히 생각해도 돼요",
  "편안한 마음으로 골라주세요",
];

type CompatibilityQuizViewProps = {
  qIndex: number;
  total: number;
  current: CompatQuestion;
  sectionProgress: SectionProgress;
  onAnswer: (choice: "A" | "B") => void;
};

export function CompatibilityQuizView({
  qIndex,
  total,
  current,
  sectionProgress,
  onAnswer,
}: CompatibilityQuizViewProps) {
  const sectionUi = SECTION_UI[sectionProgress.section.id];
  const progressPct = Math.round(((qIndex + 1) / total) * 100);
  const encouragement = ENCOURAGEMENTS[qIndex % ENCOURAGEMENTS.length];

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-8 size-48 rounded-full bg-[#FFD6E8]/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 top-1/3 size-36 rounded-full bg-[#E8DEFF]/35 blur-3xl"
      />

      <div className="relative mt-4">
        <div
          className={cn(
            "rounded-[22px] bg-gradient-to-br p-4 shadow-[0_8px_28px_rgba(255,143,177,0.12)]",
            sectionUi.accent
          )}
        >
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-white/70 text-[22px] shadow-sm">
              {sectionUi.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-[#D4567E]">
                {sectionProgress.section.title}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-sai-text-secondary">
                {sectionProgress.section.subtitle}
              </p>
              <p className="mt-2 text-[11px] font-medium text-[#B07A9A]">
                {sectionUi.hint}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: sectionProgress.sectionTotal }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  i < sectionProgress.sectionIndex
                    ? "bg-gradient-to-r from-[#FF9EC0] to-[#FFB6D2]"
                    : "bg-white/60"
                )}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-sai-text-secondary/80">
            이 주제 {sectionProgress.sectionIndex}/{sectionProgress.sectionTotal}
          </p>
        </div>

        <div className="mt-4 rounded-full bg-white/80 px-3.5 py-2 shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-medium text-sai-text-secondary">
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3 text-[#FF9EC0]" strokeWidth={2.4} />
              {qIndex + 1}번째 이야기
            </span>
            <span>{progressPct}% 완료</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F5E8EE]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF9EC0] via-[#C4A8FF] to-[#9181F4] transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {progressPct >= 75 && (
            <p className="mt-1.5 text-center text-[10px] font-semibold text-[#E86B96]">
              조금만 더! 거의 다 왔어요 ✨
            </p>
          )}
        </div>
      </div>

      <div
        key={current.id}
        className="fade-in-up relative flex flex-1 flex-col justify-center py-8"
      >
        <p className="text-center text-[12px] font-medium text-[#C49AB0]">
          {encouragement}
        </p>

        <div className="mt-5 rounded-[26px] border border-white/80 bg-white/90 px-6 py-8 shadow-[0_12px_40px_rgba(255,143,177,0.14)] backdrop-blur-sm">
          <p className="text-center text-[11px] font-semibold tracking-wide text-[#E8A0B8]">
            Q.{qIndex + 1}
          </p>
          <h2 className="mt-3 text-center text-[21px] font-bold leading-[1.55] tracking-[-0.02em] text-sai-text">
            {current.question}
          </h2>
        </div>

        <div className="mt-6 space-y-3">
          <QuizOptionButton
            kind="agree"
            label={current.optionA.label}
            onClick={() => onAnswer("A")}
          />
          <QuizOptionButton
            kind="neutral"
            label={current.optionB.label}
            onClick={() => onAnswer("B")}
          />
        </div>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-sai-text-secondary/70">
          둘 중 더 가까운 쪽을 골라주세요
          <br />
          <span className="text-[10px]">언제든 다시 검사할 수 있어요</span>
        </p>
      </div>
    </div>
  );
}

function QuizOptionButton({
  kind,
  label,
  onClick,
}: {
  kind: "agree" | "neutral";
  label: string;
  onClick: () => void;
}) {
  const display = formatOptionLabel(label, kind);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full rounded-[20px] px-5 py-4 text-left transition-all duration-200 active:scale-[0.98]",
        kind === "agree"
          ? "border border-[#FFD0E0] bg-gradient-to-br from-[#FFF5F8] to-white shadow-[0_6px_24px_rgba(255,143,177,0.18)] hover:border-[#FFB6D2] active:shadow-[0_4px_16px_rgba(255,143,177,0.25)]"
          : "border border-[#F0E8EE] bg-white/90 shadow-[0_4px_16px_rgba(45,49,66,0.04)] hover:border-[#E8DDE5] active:bg-[#FFFBFC]"
      )}
    >
      <div className="flex items-center gap-3.5">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-[14px] text-[18px] transition-transform group-active:scale-95",
            kind === "agree"
              ? "bg-gradient-to-br from-[#FF9EC0] to-[#FFB6D2] text-white shadow-sm"
              : "bg-[#F8F4F6] text-[#C4A8B8]"
          )}
        >
          {kind === "agree" ? (
            <Heart className="size-[18px] fill-white" strokeWidth={0} />
          ) : (
            "🤔"
          )}
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "text-[15px] font-bold leading-snug",
              kind === "agree" ? "text-sai-text" : "text-sai-text/90"
            )}
          >
            {display.title}
          </p>
          {display.subtitle && (
            <p className="mt-0.5 text-[12px] text-sai-text-secondary">
              {display.subtitle}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

function formatOptionLabel(
  label: string,
  kind: "agree" | "neutral"
): { title: string; subtitle?: string } {
  if (kind === "agree") {
    return { title: label, subtitle: "나에게 해당돼요" };
  }

  if (label === "잘 모르겠다 / 아니다") {
    return { title: "잘 모르겠어요", subtitle: "나와는 조금 달라요" };
  }

  return { title: label, subtitle: "나와는 조금 달라요" };
}
