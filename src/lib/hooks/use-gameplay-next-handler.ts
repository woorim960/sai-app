"use client";

import { useLayoutEffect, useRef } from "react";
import { registerGameplayNextHandler } from "@/lib/gameplay/next-handler";

export function useGameplayNextHandler(handler: () => void): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  // 매 렌더마다 동기 등록 — 모바일에서 useEffect 지연/미실행 대비
  registerGameplayNextHandler(() => {
    handlerRef.current();
  });

  useLayoutEffect(() => {
    return () => registerGameplayNextHandler(null);
  }, []);
}
