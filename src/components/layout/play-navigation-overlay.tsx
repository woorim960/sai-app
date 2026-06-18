"use client";

import { GameplayPageSkeleton } from "@/components/gameplay/gameplay-page-skeleton";
import { MobileShell } from "@/components/layout/mobile-shell";
import { usePlayNavigation } from "@/lib/navigation/play-navigation-store";

function LobbyTransitionSkeleton() {
  return (
    <MobileShell>
      <div className="flex h-full min-h-0 flex-col px-5 pb-8 safe-pt safe-pb">
        <div className="size-10 rounded-full bg-border/60" />
        <div className="mt-8 h-7 w-40 rounded bg-border/60" />
        <div className="mt-3 h-4 w-56 rounded bg-border/40" />
        <div className="mt-8 space-y-3">
          <div className="h-16 rounded-[20px] bg-border/50" />
          <div className="h-16 rounded-[20px] bg-border/40" />
        </div>
        <div className="mt-auto h-14 w-full rounded-[18px] bg-border/60" />
      </div>
    </MobileShell>
  );
}

export function PlayNavigationOverlay() {
  const { visible, mode } = usePlayNavigation();

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-sai-bg"
      role="status"
      aria-live="polite"
      aria-label="플레이 화면으로 이동 중"
    >
      {mode === "sync" ? <LobbyTransitionSkeleton /> : <GameplayPageSkeleton />}
    </div>
  );
}
