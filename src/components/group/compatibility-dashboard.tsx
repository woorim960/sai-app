"use client";

import { useEffect, useRef, useState } from "react";
import { GitCompare, Heart, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComparisonStats } from "@/lib/group/comparison-stats";
import { getMatchRateLabel } from "@/lib/group/comparison-stats";

type CompatibilityDashboardProps = {
  stats: ComparisonStats;
  className?: string;
};

const TONE_GRADIENT: Record<"high" | "mid" | "low", [string, string]> = {
  high: ["#8576ff", "#B6A9FF"],
  mid: ["#A89EFF", "#C9C0FF"],
  low: ["#E07A5F", "#F2A98F"],
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

function useCountUp(target: number, durationMs = 1100) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs]);

  return value;
}

function MatchGauge({
  percent,
  tone,
}: {
  percent: number;
  tone: "high" | "mid" | "low";
}) {
  const animated = useCountUp(percent);
  const size = 176;
  const center = size / 2;
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;
  const [from, to] = TONE_GRADIENT[tone];
  const gradientId = `gauge-${tone}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-4 rounded-full bg-[#B6A9FF]/20 blur-2xl"
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="relative">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#EFECFB"
          strokeWidth="14"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="14"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[42px] font-extrabold leading-none tracking-[-0.03em] text-sai-text">
          {animated}
          <span className="text-[22px] font-bold text-sai-primary">%</span>
        </span>
        <span className="mt-1.5 text-[11px] font-semibold tracking-[0.06em] text-sai-text-secondary">
          MATCH
        </span>
      </div>
    </div>
  );
}

export function CompatibilityDashboard({
  stats,
  className,
}: CompatibilityDashboardProps) {
  const label = getMatchRateLabel(stats.matchRate);

  const statItems = [
    {
      icon: Heart,
      label: "일치",
      value: stats.matchCount,
      bg: "from-[#F2EFFF] to-white",
      text: "text-sai-primary",
    },
    {
      icon: GitCompare,
      label: "다름",
      value: stats.mismatchCount,
      bg: "from-[#F7F5FF] to-white",
      text: "text-[#7A6FE0]",
    },
    {
      icon: Target,
      label: "만장일치",
      value: stats.unanimousCount,
      bg: "from-[#E8F8F0] to-white",
      text: "text-[#2A9D6A]",
    },
  ];

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_12px_40px_rgba(118,99,234,0.1)]",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-[#B6A9FF]/12 blur-3xl"
      />

      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[#F0EDFF] px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-[12px] bg-[#F0EDFF]">
            <Heart className="size-4 text-sai-primary" strokeWidth={2.2} fill="#F0EDFF" />
          </span>
          <h2 className="text-[17px] font-bold tracking-[-0.02em] text-sai-text">
            궁합 분석
          </h2>
        </div>
        <span className="rounded-full bg-[#FAF8FF] px-2.5 py-1 text-[11px] font-medium text-sai-text-secondary">
          {stats.completedCount}명 · {stats.comparableCards}문항
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center px-5 pb-4 pt-5 text-center">
        <MatchGauge percent={stats.matchRate} tone={label.tone} />
        <p className="mt-5 text-[21px] font-bold tracking-[-0.02em] text-sai-text">
          {label.title}
        </p>
        <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-sai-text-secondary">
          {label.description}
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-2 px-5 pb-5">
        {statItems.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-[18px] bg-gradient-to-b px-2 py-4 text-center",
              item.bg
            )}
          >
            <item.icon className={cn("mx-auto size-4", item.text)} strokeWidth={2.2} />
            <p className={cn("mt-2 text-[24px] font-extrabold leading-none tracking-[-0.02em]", item.text)}>
              {item.value}
            </p>
            <p className="mt-1.5 text-[11px] font-medium text-sai-text-secondary">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
