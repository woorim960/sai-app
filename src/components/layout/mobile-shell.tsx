import { cn } from "@/lib/utils";

type MobileShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function MobileShell({ children, className }: MobileShellProps) {
  return (
    <div className="app-viewport flex w-full items-stretch justify-center bg-sai-bg">
      <div
        className={cn(
          "mobile-frame relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-sai-bg",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

type MobilePageContentProps = {
  children: React.ReactNode;
  className?: string;
};

/** 스플래시·온보딩 등 단독 화면의 동일한 가로 여백·콘텐츠 너비 */
export function MobilePageContent({ children, className }: MobilePageContentProps) {
  return (
    <div className={cn("mobile-content flex h-full min-h-0 flex-col", className)}>
      {children}
    </div>
  );
}
