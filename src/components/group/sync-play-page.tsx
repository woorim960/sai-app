"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { GameplayPageSkeleton } from "@/components/gameplay/gameplay-page-skeleton";
import { GameplayShell } from "@/components/gameplay/gameplay-shell";
import {
  ParticipantAvatars,
  type ParticipantAvatarItem,
} from "@/components/gameplay/participant-avatars";
import { SyncPlayFooter } from "@/components/group/sync-play-footer";
import type { Card, Deck } from "@/lib/data";
import { useClientId } from "@/lib/client-id";
import {
  advanceSyncCardRequest,
  finishSyncGroupRequest,
  saveGroupAnswerRequest,
} from "@/lib/group/api-client";
import { isSameGroupState } from "@/lib/group/state-equality";
import { removeActiveGame, upsertActiveGame } from "@/lib/group/active-games";
import {
  allParticipantsAnswered,
  canAdvanceSyncCard,
  countAnsweredParticipants,
  hasParticipantAnswered,
} from "@/lib/group/sync-card-progress";
import { useGroupStatePolling } from "@/lib/group/use-group-state-polling";
import { markDeckCompleted } from "@/lib/storage";
import { recordCoupleSessionIfPaired } from "@/lib/couple/record-session";
import { useGameplayNextHandler } from "@/lib/hooks/use-gameplay-next-handler";
import type { GroupState } from "@/lib/group/types";

type SyncPlayPageProps = {
  groupId: string;
  deck: Deck;
  cards: Card[];
  initialState: GroupState;
};

export function SyncPlayPage({
  groupId,
  deck,
  cards,
  initialState,
}: SyncPlayPageProps) {
  const clientId = useClientId();
  const [state, setState] = useState(initialState);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingOption, setSavingOption] = useState(false);
  const [markingReady, setMarkingReady] = useState(false);

  const isTypingRef = useRef(false);
  const answersRef = useRef(state.answers);
  answersRef.current = state.answers;

  const isHost = clientId ? state.group.hostClientId === clientId : false;
  const currentIndex = state.group.currentCardIndex;
  const currentCard = cards[currentIndex];
  const currentCardId = currentCard?.id;
  const isLast = currentIndex === cards.length - 1;
  const isBalance = currentCard?.type === "balance";
  const isQuestion = currentCard?.type === "question";

  const myHasAnswered = useMemo(() => {
    if (!clientId || !currentCardId) return false;
    return hasParticipantAnswered(state, currentCardId, clientId);
  }, [clientId, currentCardId, state]);

  const mySubmittedText = useMemo(() => {
    if (!clientId || !currentCardId) return "";
    const answer = state.answers.find(
      (item) => item.clientId === clientId && item.cardId === currentCardId
    );
    return answer?.answerText?.trim() ?? "";
  }, [clientId, currentCardId, state.answers]);

  const everyoneAnswered = useMemo(() => {
    if (!currentCardId) return false;
    return allParticipantsAnswered(state, currentCardId);
  }, [currentCardId, state]);

  const canHostAdvance = useMemo(() => {
    if (!currentCard) return false;
    return canAdvanceSyncCard(state, currentCard);
  }, [currentCard, state]);

  const answeredCount = useMemo(() => {
    if (!currentCardId) return 0;
    return countAnsweredParticipants(state, currentCardId);
  }, [currentCardId, state]);

  const avatarItems = useMemo<ParticipantAvatarItem[]>(
    () =>
      state.participants.map((participant) => ({
        clientId: participant.clientId,
        displayName: participant.displayName,
        isMe: participant.clientId === clientId,
        status:
          currentCardId &&
          hasParticipantAnswered(state, currentCardId, participant.clientId)
            ? "completed"
            : "playing",
      })),
    [state.participants, state, clientId, currentCardId]
  );

  useEffect(() => {
    if (state.group.status === "finished") {
      window.location.replace(`/room/${groupId}/result`);
    }
  }, [groupId, state.group.status]);

  useGroupStatePolling(groupId, setState, {
    enabled: state.group.status === "playing",
    intervalMs: 2500,
    hiddenIntervalMs: 8000,
    isPausedRef: isTypingRef,
  });

  useEffect(() => {
    if (state.group.status !== "playing" || !clientId) return;
    upsertActiveGame({
      groupId,
      deckId: deck.id,
      deckTitle: deck.title,
      mode: "sync",
      progressIndex: currentIndex,
      totalCards: cards.length,
      playPath: `/room/${groupId}/play`,
    });
  }, [
    state.group.status,
    clientId,
    groupId,
    deck.id,
    deck.title,
    currentIndex,
    cards.length,
  ]);

  const prevCardIdRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    const cardId = currentCardId ?? null;
    if (prevCardIdRef.current === cardId) {
      return;
    }

    prevCardIdRef.current = cardId;

    if (!clientId || !currentCard) {
      setSelectedOption(null);
      return;
    }

    const existing = answersRef.current.find(
      (answer) =>
        answer.clientId === clientId && answer.cardId === currentCard.id
    );

    if (isBalance) {
      setSelectedOption(existing?.selectedOption ?? null);
    } else {
      setSelectedOption(null);
    }
  }, [clientId, currentCard, currentCardId, isBalance, currentIndex]);

  const handleTypingChange = useCallback((isTyping: boolean) => {
    isTypingRef.current = isTyping;
  }, []);

  const handleSelectOption = useCallback(
    (option: "A" | "B") => {
      if (!clientId || !currentCard || !isBalance || savingOption) return;

      const cardId = currentCard.id;
      setSelectedOption(option);
      setSavingOption(true);

      void saveGroupAnswerRequest({
        groupId,
        clientId,
        cardId,
        cardType: currentCard.type,
        selectedOption: option,
        selectedLabel:
          option === "A" ? currentCard.optionA : currentCard.optionB,
      })
        .then((next) => {
          setState((prev) => {
            const activeCard = cards[prev.group.currentCardIndex];
            if (!activeCard || activeCard.id !== cardId) return prev;
            return isSameGroupState(prev, next) ? prev : next;
          });
        })
        .finally(() => {
          setSavingOption(false);
        });
    },
    [clientId, currentCard, isBalance, savingOption, groupId, cards]
  );

  const handleQuestionSubmit = useCallback(
    async (draft: string) => {
      if (
        !clientId ||
        !currentCard ||
        !isQuestion ||
        myHasAnswered ||
        markingReady
      ) {
        return;
      }

      const cardId = currentCard.id;
      const answerText = draft || undefined;

      setMarkingReady(true);
      try {
        const next = await saveGroupAnswerRequest({
          groupId,
          clientId,
          cardId,
          cardType: "question",
          selectedLabel: "답변 완료",
          answerText,
        });
        setState((prev) => {
          const activeCard = cards[prev.group.currentCardIndex];
          if (!activeCard || activeCard.id !== cardId) return prev;
          return isSameGroupState(prev, next) ? prev : next;
        });
      } finally {
        setMarkingReady(false);
      }
    },
    [
      clientId,
      currentCard,
      isQuestion,
      myHasAnswered,
      markingReady,
      groupId,
      cards,
    ]
  );

  const handleNext = useCallback(async () => {
    if (!clientId || !isHost || !canHostAdvance || submitting || !currentCard) {
      return;
    }

    setSubmitting(true);
    try {
      if (isLast) {
        await finishSyncGroupRequest(groupId, clientId);
        removeActiveGame(groupId);
        markDeckCompleted(deck.id, {
          deckTitle: deck.title,
          mode: "sync",
          groupId,
          resultHref: `/room/${groupId}/result`,
        });
        void recordCoupleSessionIfPaired({
          deckId: deck.id,
          deckTitle: deck.title,
          mode: "sync",
          minutes: deck.estimatedMinutes,
        });
        window.location.replace(`/room/${groupId}/result`);
        return;
      }

      await advanceSyncCardRequest(groupId, clientId);
      window.location.assign(`/room/${groupId}/play`);
      return;
    } finally {
      setSubmitting(false);
    }
  }, [
    clientId,
    isHost,
    canHostAdvance,
    submitting,
    currentCard,
    isLast,
    groupId,
    deck.id,
    deck.title,
    deck.estimatedMinutes,
  ]);

  useGameplayNextHandler(() => {
    void handleNext();
  });

  const headerExtra = useMemo(
    () =>
      !isHost ? (
        <p className="mt-3 text-center text-[13px] text-sai-text-secondary">
          {isBalance
            ? "모두 선택하면 Host가 다음 카드로 넘겨요"
            : "답변 완료를 누르면 Host가 다음으로 넘길 수 있어요"}
        </p>
      ) : undefined,
    [isHost, isBalance]
  );

  const footerHint = useMemo(() => {
    if (!currentCard) return null;

    return (
      <SyncPlayFooter
        state={state}
        currentCard={currentCard}
        clientId={clientId || null}
        isHost={isHost}
        isBalance={isBalance}
        isQuestion={isQuestion}
        everyoneAnswered={everyoneAnswered}
        myHasAnswered={myHasAnswered}
        answeredCount={answeredCount}
        mySubmittedText={mySubmittedText}
        markingReady={markingReady}
        onQuestionSubmit={(text) => void handleQuestionSubmit(text)}
        onTypingChange={handleTypingChange}
      />
    );
  }, [
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
    handleQuestionSubmit,
    handleTypingChange,
  ]);

  if (!currentCard) {
    return <GameplayPageSkeleton />;
  }

  return (
    <MemoGameplayShell
      cards={cards}
      currentIndex={currentIndex}
      selectedOption={selectedOption}
      onSelectOption={handleSelectOption}
      onNext={handleNext}
      backHref={`/room/${groupId}`}
      isLast={isLast}
      nextBlocked={submitting || !canHostAdvance}
      showNextButton={Boolean(clientId && isHost)}
      title={deck.title}
      participantsSlot={
        avatarItems.length > 0 ? (
          <ParticipantAvatars participants={avatarItems} />
        ) : undefined
      }
      footerHint={footerHint}
      headerExtra={headerExtra}
    />
  );
}

const MemoGameplayShell = memo(GameplayShell);
