"use client";

import { MessageSquareQuote } from "lucide-react";
import {
  ResultHorizontalScroll,
  ResultScrollItem,
} from "@/components/group/result-ui/result-horizontal-scroll";
import { RESULT_CARD_HEIGHT_PX } from "@/components/group/result-ui/constants";
import type { QuestionAnswerBoard } from "@/lib/group/result-helpers";
import { cn } from "@/lib/utils";

type QuestionAnswersBoardProps = {
  boards: QuestionAnswerBoard[];
  hostClientId: string;
  className?: string;
};

export function QuestionAnswersBoard({
  boards,
  hostClientId,
  className,
}: QuestionAnswersBoardProps) {
  if (boards.length === 0) return null;

  return (
    <section className={className}>
      <ResultHorizontalScroll>
        {boards.map(({ card, entries }, index) => (
          <ResultScrollItem key={card.id}>
            <article
              className="flex h-full flex-col rounded-[20px] border border-[#EEEDF4] bg-white p-4 shadow-[0_2px_16px_rgba(45,49,66,0.05)]"
              style={{ minHeight: RESULT_CARD_HEIGHT_PX }}
            >
              <p className="text-[11px] font-semibold text-sai-primary">
                질문 · {index + 1}
              </p>
              <p className="mt-2 line-clamp-3 text-[15px] font-bold leading-snug tracking-[-0.01em] text-sai-text">
                {card.question}
              </p>

              <ul className="mt-4 flex flex-1 flex-col gap-2.5">
                {entries.map(({ participant, text, isComplete }) => {
                  const isHost = participant.clientId === hostClientId;

                  return (
                    <li
                      key={participant.clientId}
                      className={cn(
                        "rounded-[14px] px-3.5 py-3",
                        isComplete
                          ? "bg-[#F8F6FF] ring-1 ring-[#EEEDF4]"
                          : "bg-[#FAFAFC] ring-1 ring-dashed ring-[#E8E6F0]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-sai-text">
                          {participant.displayName}
                        </span>
                        {isHost && (
                          <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-bold text-sai-primary ring-1 ring-[#E8E2FF]">
                            Host
                          </span>
                        )}
                      </div>
                      {isComplete ? (
                        text ? (
                          <p className="mt-1.5 text-[13px] leading-relaxed text-sai-text">
                            {text}
                          </p>
                        ) : (
                          <p className="mt-1.5 text-[12px] italic text-sai-text-secondary">
                            답변만 완료했어요
                          </p>
                        )
                      ) : (
                        <p className="mt-1.5 text-[12px] text-sai-text-secondary">
                          아직 답변하지 않았어요
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </article>
          </ResultScrollItem>
        ))}
      </ResultHorizontalScroll>
    </section>
  );
}

export function QuestionAnswersBoardIcon() {
  return <MessageSquareQuote className="size-3.5" strokeWidth={2.2} />;
}
