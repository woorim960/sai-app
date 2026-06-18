import { cn } from "@/lib/utils";
import type { InsightHighlight, PersonaChoice } from "@/lib/group/insight-highlights";
import {
  ResultCardFooter,
  ResultCardShell,
} from "@/components/group/result-ui/result-card-shell";

const KIND_THEME: Record<
  InsightHighlight["kind"],
  { border: string; badge: string; accent: string }
> = {
  "my-persona": {
    border: "border-sai-primary/15",
    badge: "bg-sai-primary/10 text-sai-primary",
    accent: "text-sai-primary",
  },
  "debate-spark": {
    border: "border-[#E07A5F]/20",
    badge: "bg-[#FFE8E0] text-[#E07A5F]",
    accent: "text-[#E07A5F]",
  },
  unanimous: {
    border: "border-[#2A9D6A]/20",
    badge: "bg-[#D4F5E4] text-[#2A9D6A]",
    accent: "text-[#2A9D6A]",
  },
  "perfect-match": {
    border: "border-sai-primary/20",
    badge: "bg-accent text-sai-primary",
    accent: "text-sai-primary",
  },
};

function AvatarPills({
  names,
  variant = "primary",
}: {
  names: string[];
  variant?: "primary" | "neutral" | "success";
}) {
  const dot = {
    primary: "bg-sai-primary",
    neutral: "bg-[#C4BBFF]",
    success: "bg-[#6DD4A8]",
  }[variant];

  return (
    <div className="flex flex-wrap gap-1.5">
      {names.map((name) => (
        <span
          key={name}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-sai-text shadow-sm"
        >
          <span className={cn("h-2 w-2 rounded-full", dot)} />
          {name}
        </span>
      ))}
    </div>
  );
}

function ChoiceRow({ choice, index }: { choice: PersonaChoice; index: number }) {
  return (
    <li className="rounded-[12px] bg-white p-2.5 shadow-sm">
      <p className="text-[10px] font-medium text-sai-text-secondary">
        {index + 1}번째 선택
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1">
        <span
          className={cn(
            "rounded-[8px] px-2 py-1.5 text-center text-[10px] font-semibold leading-tight",
            choice.myOption === "A"
              ? "bg-sai-primary text-white"
              : "bg-accent/50 text-sai-text-secondary/70"
          )}
        >
          {choice.optionA}
        </span>
        <span
          className={cn(
            "rounded-[8px] px-2 py-1.5 text-center text-[10px] font-semibold leading-tight",
            choice.myOption === "B"
              ? "bg-sai-primary text-white"
              : "bg-accent/50 text-sai-text-secondary/70"
          )}
        >
          {choice.optionB}
        </span>
      </div>
    </li>
  );
}

function SplitBar({ aPercent, bPercent }: { aPercent: number; bPercent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex h-4 overflow-hidden rounded-full">
        <div
          className="bg-sai-primary"
          style={{ width: `${Math.max(aPercent, aPercent > 0 ? 12 : 0)}%` }}
        />
        <div
          className="bg-[#C4BBFF]"
          style={{ width: `${Math.max(bPercent, bPercent > 0 ? 12 : 0)}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-semibold">
        <span className="text-sai-primary">{aPercent}%</span>
        <span className="text-sai-text">{bPercent}%</span>
      </div>
    </div>
  );
}

function HighlightBody({ highlight }: { highlight: InsightHighlight }) {
  if (highlight.kind === "my-persona" && highlight.choices) {
    return (
      <ul className="space-y-2">
        {highlight.choices.map((choice, index) => (
          <ChoiceRow key={`${choice.myLabel}-${index}`} choice={choice} index={index} />
        ))}
      </ul>
    );
  }

  if (
    highlight.kind === "debate-spark" &&
    highlight.optionA &&
    highlight.optionB
  ) {
    return (
      <div className="flex h-full flex-col justify-center space-y-3">
        <SplitBar
          aPercent={highlight.aPercent ?? 50}
          bPercent={highlight.bPercent ?? 50}
        />
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[12px] border border-sai-primary/20 bg-white p-2.5">
            <p className="text-[10px] font-bold text-sai-primary">
              A · {highlight.aCount}명
            </p>
            <p className="mt-1 text-[11px] font-semibold leading-tight text-sai-text">
              {highlight.optionA}
            </p>
            <div className="mt-2">
              <AvatarPills names={highlight.aNames ?? []} variant="primary" />
            </div>
          </div>
          <div className="rounded-[12px] border border-[#C4BBFF] bg-white p-2.5">
            <p className="text-[10px] font-bold text-sai-text-secondary">
              B · {highlight.bCount}명
            </p>
            <p className="mt-1 text-[11px] font-semibold leading-tight text-sai-text">
              {highlight.optionB}
            </p>
            <div className="mt-2">
              <AvatarPills names={highlight.bNames ?? []} variant="neutral" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (highlight.kind === "unanimous" && highlight.matchedLabel) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2A9D6A] text-[22px] text-white shadow-md">
          ✓
        </div>
        <p className="mt-4 text-[16px] font-bold text-[#2A9D6A]">
          {highlight.matchedLabel}
        </p>
        <p className="mt-1 text-[11px] text-sai-text-secondary">
          {highlight.allNames?.length ?? 0}명 전원 일치
        </p>
        <div className="mt-4">
          <AvatarPills names={highlight.allNames ?? []} variant="success" />
        </div>
      </div>
    );
  }

  if (highlight.kind === "perfect-match" && highlight.matchedLabel) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="w-full rounded-[14px] border-2 border-sai-primary/25 bg-white px-4 py-5">
          <p className="text-[10px] font-semibold text-sai-primary">모두의 선택</p>
          <p className="mt-2 text-[18px] font-bold text-sai-text">
            {highlight.matchedLabel}
          </p>
        </div>
        <div className="mt-4">
          <AvatarPills names={highlight.allNames ?? []} variant="primary" />
        </div>
      </div>
    );
  }

  return null;
}

export function HighlightScrollCard({ highlight }: { highlight: InsightHighlight }) {
  const theme = KIND_THEME[highlight.kind];

  return (
    <ResultCardShell
      emoji={highlight.emoji}
      badge="하이라이트"
      badgeClassName={theme.badge}
      title={highlight.title}
      subtitle={highlight.subtitle}
      className={theme.border}
      footer={<ResultCardFooter>{highlight.conversationStarter}</ResultCardFooter>}
    >
      <HighlightBody highlight={highlight} />
    </ResultCardShell>
  );
}
