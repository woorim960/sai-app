"use client";

import { memo } from "react";
import type { Card } from "@/lib/data";
import { SyncCardAnswers } from "@/components/group/sync-card-answers";
import { SyncQuestionAnswerForm } from "@/components/group/sync-question-answer-form";
import type { GroupState } from "@/lib/group/types";

type SyncPlayFooterProps = {
  state: GroupState;
  currentCard: Card;
  clientId: string | null;
  isHost: boolean;
  isBalance: boolean;
  isQuestion: boolean;
  everyoneAnswered: boolean;
  myHasAnswered: boolean;
  answeredCount: number;
  mySubmittedText: string;
  markingReady: boolean;
  onQuestionSubmit: (text: string) => void;
  onTypingChange: (isTyping: boolean) => void;
};

function SyncPlayFooterInner({
  state,
  currentCard,
  clientId,
  isHost,
  isBalance,
  isQuestion,
  everyoneAnswered,
  myHasAnswered,
  answeredCount,
  mySubmittedText,
  markingReady,
  onQuestionSubmit,
  onTypingChange,
}: SyncPlayFooterProps) {
  return (
    <div className="space-y-3">
      <SyncCardAnswers state={state} card={currentCard} />

      {isQuestion && clientId && (
        <SyncQuestionAnswerForm
          cardId={currentCard.id}
          submittedText={mySubmittedText}
          onSubmit={onQuestionSubmit}
          onTypingChange={onTypingChange}
          isSubmitting={markingReady}
          isCompleted={myHasAnswered}
        />
      )}

      {isHost ? (
        <p className="text-center text-[12.5px] text-sai-text-secondary">
          {everyoneAnswered
            ? "모두 완료했어요 · 다음 질문으로 넘어가세요"
            : `${answeredCount}/${state.participants.length}명 완료 · 모두 끝나면 다음으로 넘어갈 수 있어요`}
        </p>
      ) : myHasAnswered ? (
        <p className="text-center text-[12.5px] text-sai-text-secondary">
          {everyoneAnswered
            ? "모두 완료했어요 · Host가 다음 질문으로 넘길 거예요"
            : isBalance
              ? "선택 완료! 다른 참여자를 기다리는 중이에요"
              : "다른 참여자의 답변을 기다리는 중이에요"}
        </p>
      ) : isBalance ? (
        <p className="text-center text-[12.5px] text-sai-text-secondary">
          마음에 가는 쪽을 골라주세요
        </p>
      ) : null}
    </div>
  );
}

export const SyncPlayFooter = memo(SyncPlayFooterInner);
