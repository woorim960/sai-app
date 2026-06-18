"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Loader2 } from "lucide-react";
import type { Deck } from "@/lib/data";
import type { GroupMode } from "@/lib/group/types";
import { useDeckPlayStart } from "@/lib/hooks/use-deck-play-start";
import { getCachedPlayStart } from "@/lib/group/play-start-cache";
import { cn } from "@/lib/utils";

type DeckPlayActionsProps = {
  deck: Deck;
  isLocked: boolean;
};

const actionBaseClass =
  "flex w-full items-center gap-4 rounded-[20px] px-5 py-4 text-left transition-all active:scale-[0.99] touch-manipulation";

type PlayActionButtonProps = {
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  onWarmStart?: () => void;
  children: React.ReactNode;
};

function PlayActionButton({
  disabled,
  loading,
  className,
  onClick,
  onWarmStart,
  children,
}: PlayActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      onPointerEnter={onWarmStart}
      onPointerDown={onWarmStart}
      onFocus={onWarmStart}
      className={cn(
        actionBaseClass,
        (disabled || loading) && "opacity-60",
        className
      )}
    >
      {loading ? (
        <span className="flex w-full items-center justify-center gap-2 py-1">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-[14px] font-medium">시작하는 중...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export function DeckPlayActions({ deck, isLocked }: DeckPlayActionsProps) {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [startingMode, setStartingMode] = useState<GroupMode | null>(null);
  const [startError, setStartError] = useState("");
  const { warmStart, startPlay } = useDeckPlayStart({
    deckId: deck.id,
    isLocked,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const unlockHref = `/api/decks/${deck.id}/unlock`;

  const errorCode = mounted ? searchParams.get("error") : null;
  const errorMessage =
    startError ||
    (errorCode === "start_failed"
      ? "시작에 실패했어요. 다시 시도해주세요."
      : errorCode === "no_cards"
        ? "이 덱의 카드가 아직 준비되지 않았어요."
        : null);

  const handleStart = (mode: GroupMode) => {
    if (isLocked || startingMode) return;

    setStartError("");
    const isInstant = Boolean(getCachedPlayStart(deck.id, mode));
    if (!isInstant) setStartingMode(mode);

    void startPlay(mode).then((navigated) => {
      if (!navigated) {
        setStartError("시작에 실패했어요. 다시 시도해주세요.");
        setStartingMode(null);
      }
    });
  };

  const asyncLoading = startingMode === "async";
  const syncLoading = startingMode === "sync";

  return (
    <>
      {isLocked && (
        <div className="sai-card-soft mt-6 space-y-3 px-4 py-4 text-center">
          <p className="text-[14px] leading-relaxed text-sai-text-secondary">
            Premium 덱 체험판이에요.
            <br />
            <span className="text-[12.5px]">
              결제 없이 미리 플레이해볼 수 있어요.
            </span>
          </p>
          <a
            href={unlockHref}
            className="flex h-11 w-full items-center justify-center rounded-[14px] border border-sai-primary text-[14px] font-medium text-sai-primary touch-manipulation transition-colors active:bg-sai-primary/5"
          >
            체험판 시작하기
          </a>
        </div>
      )}

      {errorMessage && (
        <p className="mt-4 text-center text-[13px] text-red-500">{errorMessage}</p>
      )}

      <div className="mt-9 pb-4">
        <p className="text-[17px] font-bold tracking-[-0.01em] text-sai-text">
          어떻게 플레이할까요?
        </p>

        <div className="mt-4 space-y-3">
          <PlayActionButton
            disabled={isLocked}
            loading={asyncLoading}
            onWarmStart={() => warmStart("async")}
            onClick={() => handleStart("async")}
            className="bg-gradient-to-r from-sai-primary to-[#A99BFF] text-white shadow-[0_10px_28px_rgba(145,129,244,0.32)]"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-white/20 text-[26px]">
              📝
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="block text-[16px] font-bold">각자하기</span>
                <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                  추천
                </span>
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-white/85">
                각자 답한 뒤 결과에서 비교해요
              </span>
            </span>
            <ChevronRight className="size-5 shrink-0 text-white/90" strokeWidth={2.4} />
          </PlayActionButton>

          <PlayActionButton
            disabled={isLocked}
            loading={syncLoading}
            onWarmStart={() => warmStart("sync")}
            onClick={() => handleStart("sync")}
            className="border border-[#E5E1FA] bg-white text-sai-text shadow-[0_4px_18px_rgba(45,49,66,0.06)]"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-[16px] bg-accent text-[26px]">
              🤝
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-bold text-sai-text">
                함께하기
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug text-sai-text-secondary">
                링크로 모여 같은 카드를 실시간으로
              </span>
            </span>
            <ChevronRight
              className="size-5 shrink-0 text-sai-primary"
              strokeWidth={2.4}
            />
          </PlayActionButton>
        </div>
      </div>
    </>
  );
}
