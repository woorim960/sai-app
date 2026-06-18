"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHintBanner } from "@/components/layout/onboarding-hint-banner";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import type { Deck } from "@/lib/data";
import {
  useClientId,
  useDefaultDisplayName,
  setDisplayName,
} from "@/lib/client-id";
import { joinGroupRequest } from "@/lib/group/api-client";
import { getParticipant } from "@/lib/group/result-helpers";
import type { GroupState } from "@/lib/group/types";

type JoinScreenProps = {
  groupId: string;
  deck: Deck;
  initialState: GroupState;
  playPath: string;
  resultPath: string;
  lobbyPath?: string;
};

export function JoinScreen({
  groupId,
  deck,
  initialState,
  playPath,
  resultPath,
  lobbyPath,
}: JoinScreenProps) {
  const router = useRouter();
  const clientId = useClientId();
  const defaultName = useDefaultDisplayName();
  const [name, setName] = useState(defaultName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const isFinished = initialState.group.status === "finished";

  useEffect(() => {
    setName(defaultName);
  }, [defaultName]);

  useEffect(() => {
    if (!clientId || redirecting) return;

    const existing = getParticipant(initialState, clientId);
    if (!existing) return;

    setRedirecting(true);

    if (existing.status === "completed" || isFinished) {
      router.replace(resultPath);
      return;
    }

    if (initialState.group.mode === "sync") {
      if (initialState.group.status === "playing") {
        router.replace(`/room/${groupId}/play`);
        return;
      }
      router.replace(lobbyPath ?? `/room/${groupId}`);
      return;
    }

    router.replace(playPath);
  }, [
    clientId,
    groupId,
    initialState,
    isFinished,
    lobbyPath,
    playPath,
    redirecting,
    resultPath,
    router,
  ]);

  const handleJoin = async () => {
    if (!clientId) return;

    const trimmed = name.trim();
    if (!trimmed) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      setDisplayName(trimmed);
      const state = await joinGroupRequest({
        groupId,
        clientId,
        displayName: trimmed,
      });

      if (state.group.mode === "sync") {
        router.push(lobbyPath ?? `/room/${groupId}`);
        return;
      }

      router.push(playPath);
    } catch {
      setError(
        isFinished
          ? "이미 종료된 대화예요."
          : "입장에 실패했어요. 다시 시도해주세요."
      );
      setLoading(false);
    }
  };

  const existing = clientId ? getParticipant(initialState, clientId) : undefined;

  if (isFinished) {
    return (
      <MobileShell className="page-enter flex h-full flex-col px-6 safe-pt safe-pb">
        <div className="flex h-full flex-col justify-center text-center">
          <h1 className="text-[26px] font-semibold text-sai-text">
            {deck.title}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-sai-text-secondary">
            이미 종료된 대화예요.
            <br />
            결과 화면에서 참여자들의 선택을 볼 수 있어요.
          </p>
          <Button
            onClick={() => router.push(resultPath)}
            className="mt-8 h-14 w-full rounded-[18px] bg-sai-primary text-[16px] font-medium text-white"
          >
            결과 보기
          </Button>
        </div>
      </MobileShell>
    );
  }

  if (existing || redirecting) {
    return (
      <MobileShell className="page-enter flex h-full flex-col px-6 safe-pt safe-pb">
        <div className="flex h-full flex-col items-center justify-center">
          <p className="text-[15px] text-sai-text-secondary">이동 중...</p>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell className="page-enter flex h-full flex-col overflow-hidden px-6 safe-pt">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          <OnboardingHintBanner className="mb-5" />
          <h1 className="text-[26px] font-semibold text-sai-text">{deck.title}</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-sai-text-secondary">
            친구가 보낸 <span className="font-medium text-sai-text">게임 초대</span>
            링크예요.
            <br />
            닉네임을 입력하고 각자 플레이를 시작하세요.
            <br />
            <span className="text-[13px] text-sai-text-secondary/80">
              커플 연결은 둘이하기 탭의 &apos;연결하기&apos;에서 해요.
            </span>
          </p>

          <div className="mt-8">
            <label
              htmlFor="display-name"
              className="text-[13px] font-medium text-sai-text-secondary"
            >
              닉네임
            </label>
            <input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={12}
              placeholder="플레이어"
              className="mt-2 h-14 w-full rounded-[16px] border border-border bg-sai-surface px-4 text-[16px] text-sai-text outline-none focus:border-sai-primary"
            />
            {error && <p className="mt-2 text-[13px] text-red-500">{error}</p>}
          </div>
        </div>

        <div className="shrink-0 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            onClick={() => void handleJoin()}
            disabled={loading || !clientId}
            className="h-14 w-full rounded-[18px] bg-sai-primary text-[16px] font-medium text-white hover:bg-sai-primary/90"
          >
            {loading ? "입장 중..." : "참여하기"}
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}
