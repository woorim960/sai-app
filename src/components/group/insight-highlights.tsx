import { cn } from "@/lib/utils";
import type { InsightHighlight } from "@/lib/group/insight-highlights";

type InsightHighlightsProps = {
  highlights: InsightHighlight[];
  className?: string;
};

const KIND_STYLES: Record<
  InsightHighlight["kind"],
  { accent: string; bg: string; border: string }
> = {
  "my-persona": {
    accent: "text-sai-primary",
    bg: "from-[#F0EDFF] to-white",
    border: "border-sai-primary/20",
  },
  "debate-spark": {
    accent: "text-[#E07A5F]",
    bg: "from-[#FFF0EC] to-white",
    border: "border-[#E07A5F]/20",
  },
  unanimous: {
    accent: "text-[#2A9D6A]",
    bg: "from-[#E8F8F0] to-white",
    border: "border-[#2A9D6A]/20",
  },
  "perfect-match": {
    accent: "text-sai-primary",
    bg: "from-[#EDE9FF] to-white",
    border: "border-sai-primary/25",
  },
};

function AvatarStack({
  names,
  variant = "primary",
  size = "md",
}: {
  names: string[];
  variant?: "primary" | "neutral" | "success";
  size?: "sm" | "md";
}) {
  if (names.length === 0) return null;

  const sizeClass = size === "sm" ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-[12px]";
  const colors = {
    primary: "bg-sai-primary text-white",
    neutral: "bg-[#C4BBFF] text-sai-text",
    success: "bg-[#6DD4A8] text-white",
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {names.map((name) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <div
            className={cn(
              "flex items-center justify-center rounded-full font-semibold",
              sizeClass,
              colors[variant]
            )}
          >
            {name.slice(0, 1)}
          </div>
          <span className="max-w-[52px] truncate text-[10px] text-sai-text-secondary">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

function SplitBarChart({
  optionA,
  optionB,
  aPercent,
  bPercent,
  aCount,
  bCount,
  winnerSide,
  size = "md",
}: {
  optionA: string;
  optionB: string;
  aPercent: number;
  bPercent: number;
  aCount?: number;
  bCount?: number;
  winnerSide?: "A" | "B" | null;
  size?: "md" | "lg";
}) {
  const barHeight = size === "lg" ? "h-6" : "h-5";

  return (
    <div className="space-y-3">
      <div className={cn("flex overflow-hidden rounded-full", barHeight)}>
        <div
          className={cn(
            "flex items-center justify-center bg-sai-primary text-white transition-all",
            winnerSide === "B" && "opacity-35"
          )}
          style={{ width: `${Math.max(aPercent, aPercent > 0 ? 14 : 0)}%` }}
        >
          {aPercent >= 18 && (
            <span className="text-[11px] font-semibold">{aPercent}%</span>
          )}
        </div>
        <div
          className={cn(
            "flex items-center justify-center bg-[#C4BBFF] text-sai-text transition-all",
            winnerSide === "A" && "opacity-35"
          )}
          style={{ width: `${Math.max(bPercent, bPercent > 0 ? 14 : 0)}%` }}
        >
          {bPercent >= 18 && (
            <span className="text-[11px] font-semibold">{bPercent}%</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[14px] bg-accent/80 px-3 py-2.5">
          <p className="text-[10px] font-medium text-sai-primary">
            A{aCount !== undefined ? ` · ${aCount}명` : ""}
          </p>
          <p className="mt-0.5 text-[13px] font-semibold leading-snug text-sai-text">
            {optionA}
          </p>
        </div>
        <div className="rounded-[14px] bg-[#F5F3FF] px-3 py-2.5">
          <p className="text-[10px] font-medium text-sai-text-secondary">
            B{bCount !== undefined ? ` · ${bCount}명` : ""}
          </p>
          <p className="mt-0.5 text-[13px] font-semibold leading-snug text-sai-text">
            {optionB}
          </p>
        </div>
      </div>
    </div>
  );
}

function PersonaVisual({ chips }: { chips: string[] }) {
  const colors = [
    "bg-sai-primary",
    "bg-[#A89EFF]",
    "bg-[#C4BBFF]",
    "bg-[#6DD4A8]",
    "bg-[#E07A5F]",
    "bg-[#F4C27A]",
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-center gap-1 px-2 pt-2">
        {chips.slice(0, 6).map((chip, index) => {
          const height = 36 + (index % 3) * 14;
          return (
            <div key={chip} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-full rounded-t-[8px] transition-all",
                  colors[index % colors.length]
                )}
                style={{ height }}
              />
              <span className="max-w-full truncate text-[9px] font-medium text-sai-text-secondary">
                {chip}
              </span>
            </div>
          );
        })}
      </div>

      <ul className="space-y-2 border-t border-border/60 pt-3">
        {chips.map((chip, index) => (
          <li key={chip} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white",
                colors[index % colors.length]
              )}
            >
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-sai-text">
                {chip}
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-accent">
                <div
                  className={cn("h-full rounded-full", colors[index % colors.length])}
                  style={{ width: `${100 - index * 8}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function VsBattleVisual({ highlight }: { highlight: InsightHighlight }) {
  if (!highlight.optionA || !highlight.optionB) return null;

  return (
    <div className="space-y-4">
      <SplitBarChart
        optionA={highlight.optionA}
        optionB={highlight.optionB}
        aPercent={highlight.aPercent ?? 50}
        bPercent={highlight.bPercent ?? 50}
        aCount={highlight.aCount}
        bCount={highlight.bCount}
        size="lg"
      />

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="rounded-[16px] border-2 border-sai-primary/30 bg-accent/50 p-3">
          <p className="mb-2 text-center text-[11px] font-bold text-sai-primary">
            A 팀
          </p>
          <AvatarStack names={highlight.aNames ?? []} variant="primary" />
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF0EC] text-[13px] font-black text-[#E07A5F]">
          VS
        </div>

        <div className="rounded-[16px] border-2 border-[#C4BBFF] bg-[#F5F3FF] p-3">
          <p className="mb-2 text-center text-[11px] font-bold text-sai-text-secondary">
            B 팀
          </p>
          <AvatarStack names={highlight.bNames ?? []} variant="neutral" />
        </div>
      </div>
    </div>
  );
}

function UnanimousVisual({ highlight }: { highlight: InsightHighlight }) {
  if (!highlight.optionA || !highlight.optionB || !highlight.matchedLabel) {
    return null;
  }

  const winnerSide = highlight.matchedSide ?? "A";

  return (
    <div className="space-y-4">
      <SplitBarChart
        optionA={highlight.optionA}
        optionB={highlight.optionB}
        aPercent={highlight.aPercent ?? 0}
        bPercent={highlight.bPercent ?? 0}
        aCount={highlight.aCount}
        bCount={highlight.bCount}
        winnerSide={winnerSide}
        size="lg"
      />

      <div className="flex flex-col items-center rounded-[18px] bg-[#E8F8F0]/60 px-4 py-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2A9D6A] text-[22px] text-white">
          ✓
        </div>
        <p className="mt-3 text-center text-[16px] font-bold text-[#2A9D6A]">
          {highlight.matchedLabel}
        </p>
        <p className="mt-1 text-[12px] text-sai-text-secondary">
          {highlight.allNames?.length ?? 0}명 전원 일치
        </p>
        <div className="mt-4">
          <AvatarStack
            names={highlight.allNames ?? []}
            variant="success"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

function PerfectMatchVisual({ highlight }: { highlight: InsightHighlight }) {
  if (!highlight.optionA || !highlight.optionB || !highlight.matchedLabel) {
    return null;
  }

  const names = highlight.allNames ?? [];

  return (
    <div className="space-y-4">
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute inset-x-6 top-1/2 h-px bg-sai-primary/20" />
        <div className="relative z-10 flex flex-wrap justify-center gap-3 px-2">
          {names.map((name) => (
            <div key={name} className="flex flex-col items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sai-primary/15 text-[12px] font-bold text-sai-primary">
                {name.slice(0, 1)}
              </div>
              <svg
                width="24"
                height="20"
                viewBox="0 0 24 20"
                className="text-sai-primary/40"
                aria-hidden
              >
                <path
                  d="M12 0 L12 14 M8 10 L12 14 L16 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[18px] border-2 border-sai-primary/30 bg-gradient-to-b from-accent to-white px-4 py-5 text-center">
        <p className="text-[11px] font-medium text-sai-primary">모두의 선택</p>
        <p className="mt-2 text-[18px] font-bold text-sai-text">
          {highlight.matchedLabel}
        </p>
        <p className="mt-2 text-[12px] text-sai-text-secondary">
          {highlight.optionA} VS {highlight.optionB}
        </p>
      </div>

      <AvatarStack names={names} variant="primary" size="sm" />
    </div>
  );
}

function HighlightCard({ highlight }: { highlight: InsightHighlight }) {
  const style = KIND_STYLES[highlight.kind];

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[22px] border bg-gradient-to-b shadow-[0_2px_24px_rgba(30,30,30,0.04)]",
        style.bg,
        style.border
      )}
    >
      <div className="px-5 pb-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white/80 text-[28px] shadow-sm">
            {highlight.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={cn("text-[17px] font-bold", style.accent)}>
              {highlight.title}
            </h3>
            <p className="mt-0.5 text-[13px] text-sai-text-secondary">
              {highlight.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[18px] bg-white/70 p-4 backdrop-blur-sm">
          {highlight.kind === "my-persona" && highlight.chips && (
            <PersonaVisual chips={highlight.chips} />
          )}
          {highlight.kind === "debate-spark" && (
            <VsBattleVisual highlight={highlight} />
          )}
          {highlight.kind === "unanimous" && (
            <UnanimousVisual highlight={highlight} />
          )}
          {highlight.kind === "perfect-match" && (
            <PerfectMatchVisual highlight={highlight} />
          )}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-[14px] bg-white/60 px-3.5 py-3">
          <span className="text-[16px] leading-none">💬</span>
          <p className="text-[13px] leading-relaxed text-sai-text">
            {highlight.conversationStarter}
          </p>
        </div>
      </div>
    </article>
  );
}

export function InsightHighlights({
  highlights,
  className,
}: InsightHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-[13px] font-medium text-sai-text-secondary">
        하이라이트
      </h2>
      {highlights.map((highlight) => (
        <HighlightCard key={highlight.id} highlight={highlight} />
      ))}
    </section>
  );
}
