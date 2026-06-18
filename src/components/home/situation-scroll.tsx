import type { Situation } from "@/lib/data";
import { SituationChip } from "./situation-chip";

type SituationScrollProps = {
  situations: Situation[];
};

export function SituationScroll({ situations }: SituationScrollProps) {
  return (
    <div
      className="hide-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-1 snap-x snap-mandatory"
      aria-label="상황 선택"
    >
      {situations.map((situation) => (
        <SituationChip key={situation.id} situation={situation} />
      ))}
    </div>
  );
}
