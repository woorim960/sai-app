import Link from "next/link";
import type { Situation } from "@/lib/data";
import { getSituationIconBg } from "@/lib/ui-theme";
import { cn } from "@/lib/utils";

type SituationChipProps = {
  situation: Situation;
  className?: string;
};

export function SituationChip({ situation, className }: SituationChipProps) {
  return (
    <Link
      href={`/situations/${situation.id}`}
      className={cn(
        "flex w-[88px] shrink-0 snap-start flex-col items-center gap-2 transition-all active:scale-[0.96]",
        className
      )}
    >
      <span
        className="flex size-[68px] items-center justify-center rounded-[22px] text-[28px] shadow-[0_2px_12px_rgba(45,49,66,0.06)]"
        style={{ backgroundColor: getSituationIconBg(situation.id) }}
      >
        {situation.emoji}
      </span>
      <span className="text-center text-[13px] font-semibold text-sai-text">
        {situation.name}
      </span>
    </Link>
  );
}
