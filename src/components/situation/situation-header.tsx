import type { Situation } from "@/lib/data";
import { getSituationListMessage } from "@/lib/data";
import { getSituationIconBg } from "@/lib/ui-theme";

type SituationHeaderProps = {
  situation: Situation;
  description?: string;
};

export function SituationHeader({
  situation,
  description,
}: SituationHeaderProps) {
  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <span
          className="flex size-12 items-center justify-center rounded-[18px] text-[26px]"
          style={{ backgroundColor: getSituationIconBg(situation.id) }}
        >
          {situation.emoji}
        </span>
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-sai-text">
          {situation.name}
        </h1>
      </div>
      <p className="mt-3 text-[14px] leading-relaxed text-sai-text-secondary">
        {description ?? getSituationListMessage(situation)}
      </p>
    </div>
  );
}
