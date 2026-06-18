"use client";

import { useLayoutEffect, useRef } from "react";
import {
  activateNextButton,
  syncNextButtonBlocked,
} from "@/lib/gameplay/activate-next-button";
import { cn } from "@/lib/utils";

type GameplayNextButtonProps = {
  isLast: boolean;
  blocked?: boolean;
  balanceRequired?: boolean;
  className?: string;
  /** React 핸들러가 있으면 우선 — 페이지 새로고침 없이 진행 */
  onNext?: () => void;
};

export function GameplayNextButton({
  isLast,
  blocked = false,
  balanceRequired = false,
  className,
  onNext,
}: GameplayNextButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const blockedRef = useRef(blocked);
  const onNextRef = useRef(onNext);
  blockedRef.current = blocked;
  onNextRef.current = onNext;

  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    syncNextButtonBlocked(button, blockedRef.current);

    const onActivate = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();

      if (onNextRef.current) {
        onNextRef.current();
        return;
      }

      void activateNextButton(button);
    };

    button.addEventListener("click", onActivate);

    return () => {
      button.removeEventListener("click", onActivate);
    };
  }, []);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    syncNextButtonBlocked(button, blocked);
  }, [blocked]);

  return (
    <button
      ref={buttonRef}
      type="button"
      data-sai-next
      data-blocked={blocked ? "true" : "false"}
      data-balance-required={balanceRequired ? "true" : "false"}
      disabled={blocked || undefined}
      className={cn(
        "gameplay-next-btn sai-btn-dark h-14 w-full touch-manipulation",
        className
      )}
    >
      {isLast ? "결과 보기" : "다음 질문"}
    </button>
  );
}
