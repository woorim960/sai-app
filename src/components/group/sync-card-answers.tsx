"use client";

import { memo } from "react";
import { Check } from "lucide-react";
import type { Card } from "@/lib/data";
import {
  getAnswersForCard,
  getParticipantAnswerLabel,
  hasParticipantAnswered,
} from "@/lib/group/sync-card-progress";
import type { GroupState } from "@/lib/group/types";
import { cn } from "@/lib/utils";

type SyncCardAnswersProps = {
  state: GroupState;
  card: Card;
  className?: string;
};

function SyncCardAnswersInner({ state, card, className }: SyncCardAnswersProps) {
  const cardAnswers = getAnswersForCard(state, card.id);
  const answeredCount = state.participants.filter((participant) =>
    hasParticipantAnswered(state, card.id, participant.clientId)
  ).length;

  return (
    <section
      className={cn(
        "rounded-[18px] border border-[#EEEDF4] bg-white p-4 shadow-[0_2px_12px_rgba(45,49,66,0.04)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-bold text-sai-text">
          {card.type === "balance" ? "우리의 선택" : "우리의 답변"}
        </p>
        <span className="text-[11px] font-semibold text-sai-primary">
          {answeredCount}/{state.participants.length}명
        </span>
      </div>

      <ul className="mt-3 space-y-2">
        {state.participants.map((participant) => {
          const answer = cardAnswers.find(
            (item) => item.clientId === participant.clientId
          );
          const label = getParticipantAnswerLabel(answer, card);
          const isHost = participant.clientId === state.group.hostClientId;

          return (
            <li
              key={participant.clientId}
              className={cn(
                "flex items-center justify-between gap-3 rounded-[12px] px-3 py-2.5",
                label ? "bg-[#F6F4FF]" : "bg-[#FAFAFC]"
              )}
            >
              <div className="min-w-0 flex items-center gap-2">
                <span className="truncate text-[13px] font-semibold text-sai-text">
                  {participant.displayName}
                </span>
                {isHost && (
                  <span className="shrink-0 text-[10px] font-bold text-sai-primary">
                    Host
                  </span>
                )}
              </div>

              {label ? (
                <span
                  className={cn(
                    "flex min-w-0 items-center gap-1 text-right text-[12px] font-semibold text-sai-text",
                    card.type === "question" ? "max-w-[62%]" : "max-w-[55%]"
                  )}
                >
                  <Check
                    className="size-3.5 shrink-0 text-[#34C759]"
                    strokeWidth={2.8}
                  />
                  <span className={cn(card.type === "question" && "truncate")}>
                    {label}
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[12px] text-sai-text-secondary">
                  <span className="size-1.5 rounded-full bg-sai-text-secondary/50" />
                  {card.type === "balance" ? "선택 중" : "답변 중"}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export const SyncCardAnswers = memo(SyncCardAnswersInner);
