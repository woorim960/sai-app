"use client";

import { useEffect, useRef, useState } from "react";
import { GameplayShell } from "@/components/gameplay/gameplay-shell";
import {
  ParticipantAvatars,
  type ParticipantAvatarItem,
} from "@/components/gameplay/participant-avatars";
import type { Card, Deck } from "@/lib/data";
import { balanceGroupName, readBalanceSelection } from "@/lib/gameplay/balance-dom";
import { setClientId } from "@/lib/client-id";
import {
  buildAdvanceAsyncInput,
  runAdvanceAsyncPlay,
} from "@/lib/group/group-play-next";
import { resolvePlayClientId } from "@/lib/group/resolve-play-session";
import type { PlayBootstrap } from "@/lib/group/play-bootstrap";
import { syncPlaySessionFromUrl } from "@/lib/group/sync-play-session";
import { getParticipant } from "@/lib/group/result-helpers";
import { removeActiveGame, upsertActiveGame } from "@/lib/group/active-games";
import {
  getGroupSessionToken,
  saveGroupSessionToken,
} from "@/lib/group/session-storage";
import { useGroupStatePolling } from "@/lib/group/use-group-state-polling";
import { notifyFriendJoined } from "@/lib/user-data";
import { useGameplayNextHandler } from "@/lib/hooks/use-gameplay-next-handler";
import type { GroupState } from "@/lib/group/types";

type GroupPlayPageProps = {
  groupId: string;
  deck: Deck;
  cards: Card[];
  resultPath: string;
  initialState: GroupState;
  bootstrap: PlayBootstrap | null;
};

export function GroupPlayPage({
  groupId,
  deck,
  cards,
  resultPath,
  initialState,
  bootstrap,
}: GroupPlayPageProps) {
  const initializedRef = useRef(false);
  const knownParticipantsRef = useRef(
    new Set(initialState.participants.map((item) => item.clientId))
  );

  const hasServerSession = Boolean(bootstrap?.sessionReady);

  const [state, setState] = useState(initialState);
  const [clientId, setClientIdState] = useState(bootstrap?.clientId ?? "");
  const [clientReady, setClientReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(
    bootstrap?.initialProgressIndex ?? 0
  );
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canPlay = hasServerSession || clientReady;
  const currentCard = cards[currentIndex];
  const isLast = currentIndex === cards.length - 1;
  const isBalance = currentCard?.type === "balance";

  useGroupStatePolling(groupId, setState, {
    enabled: Boolean(clientId) && canPlay,
    intervalMs: 8000,
    hiddenIntervalMs: 20000,
    onUpdate: (next) => {
      if (!clientId) return;

      for (const participant of next.participants) {
        if (knownParticipantsRef.current.has(participant.clientId)) continue;
        knownParticipantsRef.current.add(participant.clientId);
        if (participant.clientId === clientId) continue;
        notifyFriendJoined(participant.displayName, groupId, "async");
      }
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const progressFromUrl = params.get("i");
    const errorCode = params.get("error");

    syncPlaySessionFromUrl(groupId);

    if (errorCode === "select") {
      setError("선택 후 다음 질문을 눌러주세요.");
    } else if (errorCode === "save") {
      setError("저장에 실패했어요. 다시 시도해주세요.");
    } else if (errorCode === "session") {
      setError("세션이 만료됐어요. 덱 상세에서 다시 시작해주세요.");
    } else if (errorCode) {
      setError("진행에 실패했어요. 다시 시도해주세요.");
    }

    if (progressFromUrl !== null) {
      const parsed = Number.parseInt(progressFromUrl, 10);
      if (Number.isFinite(parsed)) {
        setCurrentIndex(
          Math.min(Math.max(parsed, 0), Math.max(cards.length - 1, 0))
        );
      }
    }

    if (initializedRef.current) return;

    if (bootstrap?.sessionReady) {
      setClientId(bootstrap.clientId);
      saveGroupSessionToken(groupId, bootstrap.sessionToken);
      setClientIdState(bootstrap.clientId);
      setClientReady(true);
      initializedRef.current = true;
      return;
    }

    const token = getGroupSessionToken(groupId);
    const id = resolvePlayClientId(groupId);

    if (!id || !token) {
      window.location.replace(`/invite/${groupId}`);
      return;
    }

    const me =
      getParticipant(state, id) ??
      (state.participants.length === 1 &&
      state.participants[0]?.clientId === state.group.hostClientId
        ? state.participants[0]
        : undefined);

    if (!me) {
      window.location.replace(`/invite/${groupId}`);
      return;
    }

    setClientIdState(id);
    setClientReady(true);
    initializedRef.current = true;

    if (me.status === "completed") {
      window.location.replace(resultPath);
      return;
    }

    if (me.progressIndex > 0) {
      setCurrentIndex(Math.min(me.progressIndex, cards.length - 1));
    }
  }, [bootstrap, cards.length, groupId, resultPath, state]);

  useEffect(() => {
    if (!canPlay || !clientId) return;
    upsertActiveGame({
      groupId,
      deckId: deck.id,
      deckTitle: deck.title,
      mode: "async",
      progressIndex: currentIndex,
      totalCards: cards.length,
      playPath: `/group/${groupId}/play`,
    });
  }, [canPlay, clientId, groupId, deck.id, deck.title, currentIndex, cards.length]);

  const handleNext = async () => {
    const effectiveClientId =
      clientId || resolvePlayClientId(groupId) || bootstrap?.clientId || "";
    if (!effectiveClientId || !currentCard || submitting) return;

    const effectiveSelection =
      isBalance && currentCard
        ? selectedOption ?? readBalanceSelection(balanceGroupName(currentCard.id))
        : selectedOption;

    if (isBalance && !effectiveSelection) return;

    const advanceInput = buildAdvanceAsyncInput({
      groupId,
      deck,
      cards,
      currentIndex,
      currentCard,
      selectedOption: effectiveSelection,
      resultPath,
      clientId: effectiveClientId,
      bootstrap,
    });
    if (!advanceInput) return;

    setSubmitting(true);
    setError("");

    try {
      const outcome = await runAdvanceAsyncPlay(advanceInput);
      if (outcome.kind === "next") {
        setCurrentIndex(outcome.nextIndex);
        setSelectedOption(null);
        window.history.replaceState(
          null,
          "",
          `/group/${groupId}/play?i=${outcome.nextIndex}`
        );
      }
      setSubmitting(false);
    } catch {
      setError("저장에 실패했어요. 다시 시도해주세요.");
      setSubmitting(false);
    }
  };

  useGameplayNextHandler(() => {
    void handleNext();
  });

  const avatarItems: ParticipantAvatarItem[] = state.participants.map(
    (participant) => ({
      clientId: participant.clientId,
      displayName: participant.displayName,
      isMe: participant.clientId === clientId,
      status: participant.status,
    })
  );

  if (!canPlay || !currentCard) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center text-[15px] text-sai-text-secondary">
        준비 중...
      </div>
    );
  }

  return (
    <>
      {error && (
        <p className="fixed bottom-24 left-0 right-0 z-10 text-center text-[13px] text-red-500">
          {error}
        </p>
      )}
      <GameplayShell
        cards={cards}
        currentIndex={currentIndex}
        selectedOption={selectedOption}
        onSelectOption={setSelectedOption}
        onNext={() => void handleNext()}
        backHref={`/decks/${deck.id}`}
        backConfirmMessage="진행 중인 대화가 저장됩니다. 나가시겠어요?"
        isLast={isLast}
        nextBlocked={submitting}
        title={deck.title}
        asyncPlayMeta={{
          groupId,
          clientId:
            clientId ||
            bootstrap?.clientId ||
            resolvePlayClientId(groupId) ||
            "",
          deckId: deck.id,
          deckTitle: deck.title,
          estimatedMinutes: deck.estimatedMinutes,
          resultPath,
        }}
        participantsSlot={
          avatarItems.length > 0 ? (
            <ParticipantAvatars participants={avatarItems} />
          ) : undefined
        }
      />
    </>
  );
}
