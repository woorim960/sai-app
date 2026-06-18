"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { replaceNavigationTop } from "@/lib/navigation/history";

type PendingExit = {
  href: string;
  title: string;
  message: string;
  hint?: string;
};

function resolveBackTarget(event: Event): HTMLAnchorElement | null {
  let node: Node | null = null;
  if (event.target instanceof Node) {
    node = event.target instanceof Text ? event.target.parentElement : event.target;
  }

  if (node instanceof Element) {
    const matched = node.closest<HTMLAnchorElement>("[data-sai-back]");
    if (matched) return matched;
  }

  if (event instanceof TouchEvent) {
    const touch = event.changedTouches[0];
    if (!touch) return null;
    const hit = document.elementFromPoint(touch.clientX, touch.clientY);
    return hit?.closest<HTMLAnchorElement>("[data-sai-back]") ?? null;
  }

  return null;
}

function navigateAway(href: string) {
  replaceNavigationTop(href);
  window.location.replace(href);
}

/** 게임플레이 뒤로가기 — 네이티브 confirm 대신 커스텀 다이얼로그 */
export function GameplayInteractionBridge() {
  const [pendingExit, setPendingExit] = useState<PendingExit | null>(null);
  const pendingRef = useRef<PendingExit | null>(null);
  pendingRef.current = pendingExit;

  useLayoutEffect(() => {
    const onActivate = (event: Event) => {
      const back = resolveBackTarget(event);
      if (!back) return;

      event.preventDefault();
      event.stopPropagation();

      const href = back.getAttribute("href");
      if (!href) return;

      const confirmTitle = back.dataset.confirmTitle;
      const confirmMessage = back.dataset.confirm;
      const confirmHint = back.dataset.confirmHint;

      if (confirmMessage || confirmTitle) {
        setPendingExit({
          href,
          title: confirmTitle ?? "잠깐, 나가실 건가요?",
          message:
            confirmMessage ??
            "지금까지 한 답변은 저장돼요. 나중에 이어서 할 수 있어요.",
          hint: confirmHint ?? "진행 상황은 자동 저장됩니다",
        });
        return;
      }

      navigateAway(href);
    };

    document.addEventListener("touchend", onActivate, { capture: true, passive: false });
    document.addEventListener("click", onActivate, true);

    return () => {
      document.removeEventListener("touchend", onActivate, true);
      document.removeEventListener("click", onActivate, true);
    };
  }, []);

  return (
    <ConfirmDialog
      open={Boolean(pendingExit)}
      title={pendingExit?.title ?? ""}
      message={pendingExit?.message ?? ""}
      hint={pendingExit?.hint}
      confirmLabel="나가기"
      cancelLabel="계속하기"
      onConfirm={() => {
        const target = pendingRef.current;
        setPendingExit(null);
        if (target) navigateAway(target.href);
      }}
      onCancel={() => setPendingExit(null)}
    />
  );
}
