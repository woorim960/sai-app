import type { Situation } from "@/lib/data";
import { SituationCard } from "./situation-card";

type SituationGridProps = {
  situations: Situation[];
};

export function SituationGrid({ situations }: SituationGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {situations.map((situation) => (
        <SituationCard key={situation.id} situation={situation} />
      ))}
    </div>
  );
}
