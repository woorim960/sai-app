"use client";

import { useEffect, useState, type ReactNode } from "react";

export function useCountUp(target: number, duration = 1100): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

export function AnimatedBar({
  pct,
  delayMs = 0,
  tone = "lavender",
}: {
  pct: number;
  delayMs?: number;
  tone?: "lavender" | "pink";
}) {
  const gradient =
    tone === "pink"
      ? "from-[#FF8FB1] to-[#FFB6D2]"
      : "from-[#C4BBFF] via-[#B8A8FF] to-sai-primary";

  return (
    <div className="h-2 overflow-hidden rounded-full bg-[#F0EDFF] shadow-[inset_0_1px_3px_rgba(145,129,244,0.08)]">
      <div
        className={`compat-bar-fill h-full rounded-full bg-gradient-to-r ${gradient}`}
        style={{
          width: `${pct}%`,
          animationDelay: `${delayMs}ms`,
        }}
      />
    </div>
  );
}

export function StaggerItem({
  index,
  children,
  className,
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        animation: "fade-in-up 0.5s ease-out forwards",
        animationDelay: `${120 + index * 80}ms`,
        opacity: 0,
      }}
    >
      {children}
    </div>
  );
}
