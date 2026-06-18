import { cn } from "@/lib/utils";

type PremiumBadgeProps = {
  className?: string;
  trial?: boolean;
};

export function PremiumBadge({ className, trial }: PremiumBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full bg-sai-primary/10 px-2.5 py-1 text-[11px] font-medium text-sai-primary",
        className
      )}
    >
      {trial ? "Premium · 체험 중" : "Premium"}
    </span>
  );
}
