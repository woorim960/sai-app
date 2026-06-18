import { cn } from "@/lib/utils";
import { RESULT_CARD_HEIGHT_PX } from "@/components/group/result-ui/constants";

type ResultCardShellProps = {
  emoji?: string;
  badge: string;
  badgeClassName?: string;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  bodyClassName?: string;
  className?: string;
  children: React.ReactNode;
};

export function ResultCardShell({
  emoji,
  badge,
  badgeClassName,
  title,
  subtitle,
  footer,
  bodyClassName,
  className,
  children,
}: ResultCardShellProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[22px] border border-[#EDE9FB] bg-white shadow-[0_4px_20px_rgba(118,99,234,0.08)]",
        className
      )}
      style={{ height: RESULT_CARD_HEIGHT_PX }}
    >
      <header className="shrink-0 px-4 pb-3 pt-4">
        <div className="flex items-start gap-3">
          {emoji && (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#F0EDFF] to-white text-[22px] shadow-sm">
              {emoji}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <span
              className={cn(
                "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.02em]",
                badgeClassName ?? "bg-[#F0EDFF] text-sai-primary"
              )}
            >
              {badge}
            </span>
            <h3 className="mt-2 line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.01em] text-sai-text">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-sai-text-secondary">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </header>

      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto hide-scrollbar px-4 py-2",
          bodyClassName
        )}
      >
        {children}
      </div>

      {footer && (
        <footer className="shrink-0 border-t border-[#F0EDFF] bg-gradient-to-r from-[#FAF8FF] to-white px-4 py-3">
          {footer}
        </footer>
      )}
    </article>
  );
}

export function ResultCardFooter({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 text-[12px] leading-relaxed text-sai-text">
      <span className="shrink-0 flex size-5 items-center justify-center rounded-full bg-[#F0EDFF] text-[10px]">
        💬
      </span>
      <span className="pt-0.5">{children}</span>
    </p>
  );
}
