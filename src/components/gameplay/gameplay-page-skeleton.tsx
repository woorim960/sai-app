import { MobileShell } from "@/components/layout/mobile-shell";

export function GameplayPageSkeleton() {
  return (
    <MobileShell>
      <div className="flex h-full min-h-0 flex-col px-5 pb-8 safe-pt safe-pb">
        <div className="size-10 rounded-full bg-border/60" />
        <div className="mt-6 h-4 w-16 rounded bg-border/60" />
        <div className="mt-3 h-1 w-full rounded-full bg-border/60" />

        <div className="flex flex-1 flex-col justify-center py-8">
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[32px] bg-sai-surface px-6 py-10 shadow-[0_4px_32px_rgba(30,30,30,0.06)]">
            <div className="h-6 w-24 rounded-full bg-border/60" />
            <div className="mt-8 h-8 w-3/4 rounded bg-border/60" />
            <div className="mt-4 h-4 w-1/2 rounded bg-border/40" />
          </div>
        </div>

        <div className="h-14 w-full rounded-[18px] bg-border/60" />
      </div>
    </MobileShell>
  );
}
