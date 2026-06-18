import { MobilePageContent, MobileShell } from "./mobile-shell";
import { cn } from "@/lib/utils";

type EntryFlowLayoutProps = {
  children: React.ReactNode;
  footer: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
};

/** 스플래시·온보딩 공통 — 동일한 배경·그리드·safe-area */
export function EntryFlowLayout({
  header,
  children,
  footer,
  className,
}: EntryFlowLayoutProps) {
  return (
    <MobileShell className={cn("entry-flow-shell overflow-hidden", className)}>
      <MobilePageContent
        className={cn("entry-flow-grid", !header && "entry-flow-grid--splash")}
      >
        <div aria-hidden className="entry-flow-ambient pointer-events-none" />
        {header ? (
          <header className="entry-flow-header shrink-0">{header}</header>
        ) : null}
        <main className="entry-flow-main min-h-0">{children}</main>
        <footer className="entry-flow-footer shrink-0">{footer}</footer>
      </MobilePageContent>
    </MobileShell>
  );
}
