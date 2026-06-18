"use client";

import { useLayoutEffect, useRef } from "react";
import { bindNativeTap } from "@/lib/ui/native-tap";
import { cn } from "@/lib/utils";

type NextButtonProps = {
  isLast: boolean;
  /** React 기준 비활성 (제출 중 등) — DOM 선택과 별개 */
  blocked?: boolean;
  onClick: () => void;
  className?: string;
  /** 밸런스 카드일 때 :checked radio로 활성화 */
  balanceGroupName?: string;
};

function syncReadyState(
  button: HTMLButtonElement,
  balanceGroupName: string | undefined,
  blocked: boolean
) {
  if (blocked) {
    button.dataset.ready = "false";
    return;
  }

  if (!balanceGroupName) {
    button.dataset.ready = "true";
    return;
  }

  const root = document.querySelector(
    `[data-balance-root="${balanceGroupName}"]`
  );
  const checked = root?.querySelector(".balance-option-input:checked");
  button.dataset.ready = checked ? "true" : "false";
}

export function NextButton({
  isLast,
  blocked = false,
  onClick,
  className,
  balanceGroupName,
}: NextButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onClickRef = useRef(onClick);
  const blockedRef = useRef(blocked);
  const balanceGroupRef = useRef(balanceGroupName);
  onClickRef.current = onClick;
  blockedRef.current = blocked;
  balanceGroupRef.current = balanceGroupName;

  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const sync = () => {
      syncReadyState(button, balanceGroupRef.current, blockedRef.current);
    };

    sync();

    const onBalanceActivity = () => queueMicrotask(sync);
    const roots = balanceGroupRef.current
      ? document.querySelectorAll(
          `[data-balance-root="${balanceGroupRef.current}"]`
        )
      : [];

    roots.forEach((root) => {
      root.addEventListener("change", sync);
      root.addEventListener("input", sync);
      root.addEventListener("click", onBalanceActivity, true);
      root.addEventListener("pointerup", onBalanceActivity, true);
    });

    const cleanupTap = bindNativeTap(button, () => {
      if (button.dataset.ready !== "true") return;
      onClickRef.current();
    });

    return () => {
      cleanupTap();
      roots.forEach((root) => {
        root.removeEventListener("change", sync);
        root.removeEventListener("input", sync);
        root.removeEventListener("click", onBalanceActivity, true);
        root.removeEventListener("pointerup", onBalanceActivity, true);
      });
    };
  }, [balanceGroupName, blocked]);

  return (
    <button
      ref={buttonRef}
      type="button"
      data-ready={blocked ? "false" : balanceGroupName ? "false" : "true"}
      data-requires-balance={balanceGroupName ? "true" : "false"}
      aria-disabled={blocked ? true : undefined}
      className={cn(
        "gameplay-next-btn sai-btn-dark h-14 w-full touch-manipulation",
        className
      )}
    >
      {isLast ? "결과 보기" : "다음 질문"}
    </button>
  );
}
