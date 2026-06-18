import Link from "next/link";
import type { Situation } from "@/lib/data";
import { getSituationAccent } from "@/lib/ui-theme";
import { cn } from "@/lib/utils";

type SituationCardProps = {
  situation: Situation;
  className?: string;
};

export function SituationCard({ situation, className }: SituationCardProps) {
  return (
    <Link
      href={`/situations/${situation.id}`}
      className={cn(
        "flex flex-col items-start rounded-[24px] bg-sai-surface p-5 shadow-[0_2px_24px_rgba(30,30,30,0.04)] transition-all duration-200 active:scale-[0.98]",
        className
      )}
    >
      <span
        className="flex size-11 items-center justify-center rounded-2xl text-[22px]"
        style={{ backgroundColor: getSituationAccent(situation.id) }}
      >
        {situation.emoji}
      </span>
      <h3 className="mt-4 text-[17px] font-semibold text-sai-text">
        {situation.name}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-sai-text-secondary">
        {situation.subtitle}
      </p>
    </Link>
  );
}
