"use client";

import { useLayoutEffect } from "react";
import { replaceNavigationTop } from "@/lib/navigation/history";

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

/** 뒤로가기만 document 위임 — 다음 질문은 AdvanceNextLink 네이티브 navigation */
export function GameplayInteractionBridge() {
  useLayoutEffect(() => {
    const onActivate = (event: Event) => {
      const back = resolveBackTarget(event);
      if (!back) return;

      event.preventDefault();
      event.stopPropagation();

      const confirmMessage = back.dataset.confirm;
      if (confirmMessage && !window.confirm(confirmMessage)) return;

      const href = back.getAttribute("href");
      if (!href) return;

      replaceNavigationTop(href);
      window.location.replace(href);
    };

    document.addEventListener("touchend", onActivate, { capture: true, passive: false });
    document.addEventListener("click", onActivate, true);

    return () => {
      document.removeEventListener("touchend", onActivate, true);
      document.removeEventListener("click", onActivate, true);
    };
  }, []);

  return null;
}
