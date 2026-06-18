"use client";

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type BalanceOptionsProps = {
  optionA: string;
  optionB: string;
  selected: "A" | "B" | null;
  onSelect: (option: "A" | "B") => void;
  name?: string;
  className?: string;
};

function splitLabel(label: string): { title: string; sub?: string } {
  const match = label.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (match && match[1].trim()) {
    return { title: match[1].trim(), sub: match[2].trim() };
  }
  return { title: label };
}

export function BalanceOptions({
  optionA,
  optionB,
  selected,
  onSelect,
  name,
  className,
}: BalanceOptionsProps) {
  const reactId = useId();
  const groupName = name ?? `balance-${reactId}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const notifyFromDom = () => {
      const checked = root.querySelector<HTMLInputElement>(
        ".balance-option-input:checked"
      );
      if (!checked) return;
      const value = checked.value;
      if (value === "A" || value === "B") {
        onSelectRef.current(value);
      }
    };

    const onNativeChange = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.type !== "radio" || !root.contains(target)) return;
      const value = target.value;
      if (value === "A" || value === "B") {
        onSelectRef.current(value);
      }
    };

    const onActivate = () => {
      queueMicrotask(notifyFromDom);
    };

    root.addEventListener("change", onNativeChange);
    root.addEventListener("input", onNativeChange);
    root.addEventListener("click", onActivate, true);
    root.addEventListener("pointerup", onActivate, true);

    return () => {
      root.removeEventListener("change", onNativeChange);
      root.removeEventListener("input", onNativeChange);
      root.removeEventListener("click", onActivate, true);
      root.removeEventListener("pointerup", onActivate, true);
    };
  }, [groupName]);

  useEffect(() => {
    if (selected === null) return;

    const root = rootRef.current;
    if (!root) return;

    root.querySelectorAll<HTMLInputElement>(".balance-option-input").forEach((input) => {
      input.checked = input.value === selected;
    });
  }, [selected]);

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      data-balance-root={groupName}
      className={cn("relative flex items-stretch gap-2.5", className)}
    >
      <OptionCard
        groupName={groupName}
        option="A"
        emoji="💬"
        label={optionA}
      />
      <OptionCard
        groupName={groupName}
        option="B"
        emoji="💜"
        label={optionB}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[14px] font-extrabold tracking-wide text-sai-primary shadow-[0_6px_18px_rgba(45,49,66,0.16)] ring-1 ring-black/5"
      >
        VS
      </span>
    </div>
  );
}

function OptionCard({
  groupName,
  option,
  emoji,
  label,
}: {
  groupName: string;
  option: "A" | "B";
  emoji: string;
  label: string;
}) {
  const { title, sub } = splitLabel(label);

  return (
    <div className="min-w-0 flex-1">
      <label
        data-balance-option={option}
        className={cn("balance-option touch-manipulation")}
      >
        <span className="balance-option-input-wrap" aria-hidden="true">
          <input
            type="radio"
            name={groupName}
            value={option}
            className="balance-option-input"
            tabIndex={-1}
          />
        </span>
        <span className="balance-option-emoji">{emoji}</span>
        <span className="flex flex-col gap-1">
          <span className="balance-option-title">{title}</span>
          {sub ? <span className="balance-option-sub">{sub}</span> : null}
        </span>
      </label>
    </div>
  );
}
