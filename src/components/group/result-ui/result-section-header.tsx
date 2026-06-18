import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ResultSectionHeaderProps = {
  title: string;
  description?: string;
  count?: number;
  icon?: ReactNode;
  className?: string;
};

export function ResultSectionHeader({
  title,
  description,
  count,
  icon,
  className,
}: ResultSectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-[17px] font-bold tracking-[-0.02em] text-sai-text">
          {icon && (
            <span className="flex size-7 shrink-0 items-center justify-center rounded-[10px] bg-[#F0EDFF] text-sai-primary">
              {icon}
            </span>
          )}
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-[12px] text-sai-text-secondary">{description}</p>
        )}
      </div>
      {count !== undefined && (
        <span className="shrink-0 rounded-full border border-[#EDE9FB] bg-white px-2.5 py-1 text-[11px] font-semibold text-sai-primary shadow-sm">
          총 {count}개
        </span>
      )}
    </div>
  );
}
