"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Users } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { GroupShareButton } from "@/components/group/group-share-button";
import type { Deck } from "@/lib/data";
import { useClientId } from "@/lib/client-id";
import { startSyncGroupRequest } from "@/lib/group/api-client";
import { canStartSyncLobby } from "@/lib/group/sync-card-progress";
import { useGroupStatePolling } from "@/lib/group/use-group-state-polling";
import { notifyFriendJoined } from "@/lib/user-data";
import { hidePlayNavigation } from "@/lib/navigation/play-navigation-store";
import type { GroupState } from "@/lib/group/types";
import { cn } from "@/lib/utils";

const LOBBY_STEPS = [
  { id: 1, label: "초대 링크 복사" },
  { id: 2, label: "친구에게 링크 전송" },
  { id: 3, label: "입장 확인 후 함께 시작" },
] as const;

type RoomLobbyScreenProps = {
  groupId: string;
  deck: Deck;
  initialState: GroupState;
};

export function RoomLobbyScreen({
  groupId,
  deck,
  initialState,
}: RoomLobbyScreenProps) {
  const router = useRouter();
  const clientId = useClientId();
  const [state, setState] = useState(initialState);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");
  const [lobbyStep, setLobbyStep] = useState(1);
  const knownParticipantsRef = useRef(
    new Set(initialState.participants.map((item) => item.clientId))
  );
  const isHost = clientId ? state.group.hostClientId === clientId : false;
  const canStart = canStartSyncLobby(state);
  const waitingForFriend = state.participants.length < 2;

  useLayoutEffect(() => {
    hidePlayNavigation();
  }, []);

  useEffect(() => {
    if (state.participants.length >= 2) {
      setLobbyStep(3);
    }
  }, [state.participants.length]);

  useEffect(() => {
    if (state.group.status === "playing") {
      router.replace(`/room/${groupId}/play`);
      return;
    }

    if (state.group.status === "finished") {
      router.replace(`/room/${groupId}/result`);
    }
  }, [groupId, router, state.group.status]);

  useGroupStatePolling(groupId, setState, {
    enabled: state.group.status === "waiting",
    intervalMs: 2000,
    hiddenIntervalMs: 8000,
    onUpdate: (next) => {
      if (!clientId) return;

      for (const participant of next.participants) {
        if (knownParticipantsRef.current.has(participant.clientId)) continue;
        knownParticipantsRef.current.add(participant.clientId);
        if (participant.clientId === clientId) continue;
        notifyFriendJoined(participant.displayName, groupId, "sync");
      }

      if (next.group.status === "playing") {
        router.replace(`/room/${groupId}/play`);
      }
    },
  });

  const handleStart = async () => {
    if (!clientId || !canStart) return;

    setStarting(true);
    setStartError("");

    try {
      const next = await startSyncGroupRequest(groupId, clientId);
      router.push(`/room/${groupId}/play`);
      setState(next);
    } catch {
      setStartError("시작에 실패했어요. 잠시 후 다시 시도해주세요.");
      setStarting(false);
    }
  };

  return (
    <MobileShell className="page-enter">
      <div className="flex h-full min-h-0 flex-col px-5 pb-10 safe-pt safe-pb">
        <BackButton href={`/decks/${deck.id}`} />

        <main className="mt-8 flex-1">
          <h1 className="text-[26px] font-semibold text-sai-text">{deck.title}</h1>
          <p className="mt-2 text-[15px] text-sai-text-secondary">
            함께하기 · 친구를 초대하고 같은 카드를 플레이해요
          </p>

          <div
            className={cn(
              "mt-5 flex items-center gap-2 rounded-[14px] px-3.5 py-3",
              canStart ? "bg-[#EDFAF1] text-[#2A9D6A]" : "bg-[#F6F4FF] text-sai-text-secondary"
            )}
          >
            {canStart ? (
              <Sparkles className="size-4 shrink-0" strokeWidth={2.2} />
            ) : (
              <Users className="size-4 shrink-0 text-sai-primary" strokeWidth={2.2} />
            )}
            <p className="text-[12.5px] font-medium">
              {canStart
                ? `${state.participants.length}명 모였어요 · 시작할 준비가 됐어요!`
                : `${state.participants.length}명 대기 중 · 친구 1명 이상 필요해요`}
            </p>
          </div>

          <ul className="mt-5 space-y-2">
            {state.participants.map((p) => (
              <li
                key={p.clientId}
                className="flex items-center justify-between rounded-[16px] border border-[#EEEDF4] bg-white px-4 py-3"
              >
                <span className="text-[15px] font-medium text-sai-text">
                  {p.displayName}
                </span>
                {p.clientId === state.group.hostClientId ? (
                  <span className="rounded-full bg-sai-primary/10 px-2 py-0.5 text-[11px] font-bold text-sai-primary">
                    Host
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-[#34C759]">
                    입장 완료
                  </span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-[18px] border border-[#EEEDF4] bg-white p-4">
            <p className="text-[13px] font-bold text-sai-text">이렇게 함께해요</p>
            <ol className="mt-3 space-y-2.5">
              {LOBBY_STEPS.map((step) => {
                const active = lobbyStep === step.id;
                const done = lobbyStep > step.id;
                return (
                  <li
                    key={step.id}
                    className={cn(
                      "flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] transition-colors",
                      active && "bg-accent text-sai-text",
                      done && "text-sai-text-secondary"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                        done
                          ? "bg-sai-primary text-white"
                          : active
                            ? "bg-sai-primary/15 text-sai-primary"
                            : "bg-[#F1F0F6] text-sai-text-secondary"
                      )}
                    >
                      {done ? (
                        <Check className="size-3.5" strokeWidth={2.6} />
                      ) : (
                        step.id
                      )}
                    </span>
                    <span className={cn("font-medium", active && "text-sai-text")}>
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <GroupShareButton
            groupId={groupId}
            deckTitle={deck.title}
            variant="lobby"
            className="mt-6"
            onShareSuccess={() => setLobbyStep((prev) => Math.max(prev, 2))}
          />
        </main>

        {clientId && isHost && (
          <div className="space-y-2">
            <Button
              onClick={() => void handleStart()}
              disabled={starting || !canStart}
              className={cn(
                "h-14 w-full rounded-[18px] text-[16px] font-medium text-white",
                canStart
                  ? "bg-sai-primary hover:bg-sai-primary/90"
                  : "bg-sai-primary/35"
              )}
            >
              {starting
                ? "시작 중..."
                : canStart
                  ? "함께 시작하기"
                  : "친구를 기다리는 중..."}
            </Button>
            {waitingForFriend && (
              <p className="text-center text-[12.5px] text-sai-text-secondary">
                초대 링크를 보내고 친구가 들어오면 시작할 수 있어요
              </p>
            )}
            {startError && (
              <p className="text-center text-[12.5px] text-red-500">{startError}</p>
            )}
          </div>
        )}

        {clientId && !isHost && (
          <p className="pb-4 text-center text-[14px] text-sai-text-secondary">
            Host가 친구를 모두 모으면 함께 시작해요
          </p>
        )}
      </div>
    </MobileShell>
  );
}
