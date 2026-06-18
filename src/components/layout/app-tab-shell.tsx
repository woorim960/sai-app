"use client";

import { MobileShell } from "@/components/layout/mobile-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { cn } from "@/lib/utils";

type AppTabShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppTabShell({ children, className }: AppTabShellProps) {
  return (
    <MobileShell>
      <div className="flex h-full min-h-0 flex-col">
        <main className={cn("app-viewport-scroll flex-1 px-0", className)}>
          {children}
        </main>
        <BottomNav />
      </div>
    </MobileShell>
  );
}
