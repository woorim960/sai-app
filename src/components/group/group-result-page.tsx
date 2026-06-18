"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { HighlightsScroll } from "@/components/group/highlights-scroll";
import { SplitChartsScroll } from "@/components/group/split-charts-scroll";
import { CompatibilityDashboard } from "@/components/group/compatibility-dashboard";
import { GroupShareButton } from "@/components/group/group-share-button";
import { MyResultSummary } from "@/components/group/my-result-summary";
import {
  QuestionAnswersBoard,
  QuestionAnswersBoardIcon,
} from "@/components/group/question-answers-board";
import { ResultPageHeader } from "@/components/group/result-ui/result-page-header";
import { ResultSectionHeader } from "@/components/group/result-ui/result-section-header";
import { Hand } from "lucide-react";
import type { Card, Deck } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useClientId } from "@/lib/client-id";
import {
  buildCardSplitStats,
  buildComparisonStats,
} from "@/lib/group/comparison-stats";
import { buildInsightHighlights } from "@/lib/group/insight-highlights";
import {
  buildMyBalanceResults,
  buildQuestionAnswerBoards,
  getAsyncResultStatusLabel,
  getCompletedCount,
  getInProgressParticipants,
  getParticipant,
  isComparisonAvailable,
} from "@/lib/group/result-helpers";
import { formatExpiresIn } from "@/lib/group/ttl";
import { useGroupStatePolling } from "@/lib/group/use-group-state-polling";
import { notifyComparisonReady } from "@/lib/user-data";
import type { GroupState } from "@/lib/group/types";

type GroupResultPageProps = {
  groupId: string;
  deck: Deck;
  cards: Card[];
  initialState: GroupState;
};

function InviteCta({
  title,
  description,
  buttonLabel,
  onClick,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}) {
  return (
    <div className="mb-8 rounded-[20px] border border-dashed border-sai-primary/25 bg-sai-surface px-5 py-5 text-center shadow-sm">
      <p className="text-[15px] font-semibold text-sai-text">{title}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-sai-text-secondary">
        {description}
      </p>
      <Button
        onClick={onClick}
        className="mt-4 h-12 w-full rounded-[14px] bg-sai-primary text-[15px] font-medium text-white hover:bg-sai-primary/90"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

export function GroupResultPage({
  groupId,
  deck,
  cards,
  initialState,
}: GroupResultPageProps) {
  const router = useRouter();
  const clientId = useClientId();
  const invitePath = `/invite/${groupId}`;
  const [state, setState] = useState(initialState);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const completedCountRef = useRef(getCompletedCount(initialState));
  const comparisonReadyRef = useRef(isComparisonAvailable(initialState));

  const isAsync = state.group.mode === "async";
  const completedCount = getCompletedCount(state);
  const comparisonReady = isComparisonAvailable(state);
  const allComplete =
    state.participants.length > 0 &&
    state.participants.every((p) => p.status === "completed");

  const showToast = useCallback((message: string) => {
    setToastMessage("");
    requestAnimationFrame(() => setToastMessage(message));
  }, []);

  const handlePollUpdate = useCallback(
    (next: GroupState, prev: GroupState) => {
      const prevCompleted = getCompletedCount(prev);
      const nextCompleted = getCompletedCount(next);
      const wasComparisonReady = isComparisonAvailable(prev);
      const isNowComparisonReady = isComparisonAvailable(next);

      if (nextCompleted > prevCompleted) {
        if (isNowComparisonReady && !wasComparisonReady) {
          showToast("이제 선택을 비교할 수 있어요!");
          notifyComparisonReady(groupId);
        } else {
          showToast("친구가 완료했어요. 결과가 업데이트됐어요.");
        }
      }

      completedCountRef.current = nextCompleted;
      comparisonReadyRef.current = isNowComparisonReady;
    },
    [groupId, showToast]
  );

  const shouldPoll = isAsync ? !comparisonReady : !allComplete;

  useGroupStatePolling(groupId, setState, {
    enabled: shouldPoll,
    intervalMs: 3000,
    hiddenIntervalMs: 12000,
    onUpdate: handlePollUpdate,
  });

  useEffect(() => {
    if (!toastMessage) return;
    setToastVisible(true);
    const timer = setTimeout(() => setToastVisible(false), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const me = clientId ? getParticipant(state, clientId) : undefined;
  const isHost = clientId ? state.group.hostClientId === clientId : false;
  const iAmCompleted = me?.status === "completed";
  const showShare = isHost || iAmCompleted;
  const expiresLabel = formatExpiresIn(state.group.expiresAt);
  const inProgressParticipants = getInProgressParticipants(state);
  const myBalanceResults = useMemo(() => {
    if (!clientId || !iAmCompleted) return [];
    return buildMyBalanceResults(cards, state, clientId);
  }, [cards, clientId, iAmCompleted, state]);

  const statusLabel = isAsync
    ? getAsyncResultStatusLabel(state, comparisonReady)
    : `${completedCount}명 완료 · ${state.participants.length}명 참여 중`;

  const headerParticipants = useMemo(
    () =>
      state.participants.map((participant) => ({
        displayName: participant.displayName,
        completed: participant.status === "completed",
        isMe: clientId ? participant.clientId === clientId : false,
      })),
    [clientId, state.participants]
  );

  const highlights = useMemo(() => {
    if (!clientId || !iAmCompleted || !comparisonReady) return [];
    return buildInsightHighlights(cards, state, clientId);
  }, [cards, clientId, comparisonReady, iAmCompleted, state]);

  const comparisonStats = useMemo(() => {
    if (!comparisonReady) return null;
    return buildComparisonStats(cards, state, clientId ?? undefined);
  }, [cards, clientId, comparisonReady, state]);

  const cardSplitStats = useMemo(() => {
    if (!comparisonReady) return [];
    return buildCardSplitStats(cards, state);
  }, [cards, comparisonReady, state]);

  const questionAnswerBoards = useMemo(
    () => buildQuestionAnswerBoards(cards, state),
    [cards, state]
  );

  const showWaitingPhase = isAsync && iAmCompleted && !comparisonReady;
  const showComparePhase = !isAsync || comparisonReady;

  return (
    <MobileShell className="page-enter flex h-full flex-col overflow-hidden">
      <div className="relative flex h-full min-h-0 flex-col px-6 pb-0 safe-pt">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-[#F0EDFF]/70 via-[#FAF8FF]/40 to-transparent"
        />

        <ResultPageHeader
          deckTitle={deck.title}
          statusLabel={statusLabel}
          expiresLabel={expiresLabel}
          comparisonReady={comparisonReady}
          participants={headerParticipants}
          isSync={!isAsync}
        />

        <main className="app-viewport-scroll relative z-10 mt-5 flex-1 space-y-7 pb-4">
          {clientId && !me && (
            <InviteCta
              title="이 대화에 참여해보세요"
              description="닉네임을 입력하고 각자 플레이하면 완료 후 선택을 비교할 수 있어요."
              buttonLabel="참여하기"
              onClick={() => router.push(invitePath)}
            />
          )}

          {clientId && me && !iAmCompleted && (
            <InviteCta
              title="아직 플레이하지 않았어요"
              description="플레이를 마치면 친구들과 선택을 비교할 수 있어요."
              buttonLabel="나도 플레이하기"
              onClick={() => router.push(invitePath)}
            />
          )}

          {showWaitingPhase && (
            <section className="space-y-5">
              <ResultSectionHeader
                icon={<Hand className="size-3.5" strokeWidth={2.5} />}
                title="내 결과"
                description="친구를 초대해 비교를 열어보세요"
                count={myBalanceResults.length}
              />
              <MyResultSummary results={myBalanceResults} />

              <div className="rounded-[20px] border border-dashed border-border bg-[#FAF8F5] px-5 py-5 text-center">
                <p className="text-[14px] font-semibold text-sai-text">
                  비교 결과 대기 중
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-sai-text-secondary">
                  2명 이상 플레이를 마치면 궁합 분석과 선택 분포가 열려요.
                </p>
              </div>

              {inProgressParticipants.length > 0 && (
                <div className="rounded-[18px] border border-border/60 bg-sai-surface px-4 py-4">
                  <p className="text-[12px] font-semibold text-sai-text-secondary">
                    진행 중인 친구
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {inProgressParticipants.map((participant) => (
                      <span
                        key={participant.clientId}
                        className="rounded-full bg-accent px-3 py-1 text-[12px] font-medium text-sai-primary"
                      >
                        {participant.displayName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </section>
          )}

          {showComparePhase && (
            <>
              {questionAnswerBoards.length > 0 && (
                <section className="fade-in-up space-y-3">
                  <ResultSectionHeader
                    icon={<QuestionAnswersBoardIcon />}
                    title="우리의 이야기"
                    description="질문에 남긴 답변을 함께 돌아볼 수 있어요"
                    count={questionAnswerBoards.length}
                  />
                  <QuestionAnswersBoard
                    boards={questionAnswerBoards}
                    hostClientId={state.group.hostClientId}
                  />
                </section>
              )}
              {comparisonStats && (
                <CompatibilityDashboard
                  stats={comparisonStats}
                  className="fade-in-up"
                />
              )}
              <HighlightsScroll
                highlights={highlights}
                className="fade-in-up-delay-1"
              />
              <SplitChartsScroll
                stats={cardSplitStats}
                className="fade-in-up-delay-2"
              />
            </>
          )}
        </main>

        <div className="z-20 -mx-6 mt-6 shrink-0 border-t border-white/60 bg-sai-bg/90 px-6 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-2xl">
          {showShare && (
            <GroupShareButton
              groupId={groupId}
              deckTitle={deck.title}
              compact={!isAsync}
              variant={isAsync ? "invite" : "share"}
            />
          )}
          <Link
            href="/home"
            className={cn(
              "flex w-full items-center justify-center rounded-[16px] text-[14px] font-semibold transition-all active:scale-[0.98]",
              showShare
                ? "mt-2 py-2.5 text-sai-text-secondary hover:text-sai-primary"
                : "bg-white py-3.5 text-sai-primary shadow-[0_4px_16px_rgba(118,99,234,0.1)]"
            )}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
    </MobileShell>
  );
}
