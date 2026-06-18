import { cn } from "@/lib/utils";

type InsightCardProps = {
  emoji: string;
  title: string;
  description: string;
  className?: string;
};

export function InsightCard({
  emoji,
  title,
  description,
  className,
}: InsightCardProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] bg-sai-surface px-5 py-5 shadow-[0_2px_24px_rgba(30,30,30,0.04)]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-[22px] leading-none">{emoji}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold text-sai-text">{title}</h3>
          <p className="mt-1.5 text-[14px] leading-relaxed text-sai-text-secondary">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
