"use client";

import Link from "next/link";
import {
  Heart,
  Smile,
  Users,
  UsersRound,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { HOME_CONTEXTS, type HomeContext } from "@/lib/data/home";
import { cn } from "@/lib/utils";

const CONTEXT_ICONS: Record<string, LucideIcon> = {
  couple: Users,
  friends: UsersRound,
  crush: Heart,
  drinking: Wine,
  "first-meet": Smile,
};

type HomeContextFilterProps = {
  value: string;
  onChange?: (contextId: string) => void;
};

export function HomeContextFilter({ value, onChange }: HomeContextFilterProps) {
  return (
    <div
      className="hide-scrollbar mt-4 flex gap-2.5 overflow-x-auto px-5 pb-1"
      role="tablist"
      aria-label="함께하는 상황 선택"
    >
      {HOME_CONTEXTS.map((context) => (
        <ContextChip
          key={context.id}
          context={context}
          active={value === context.id}
          onSelect={() => onChange?.(context.id)}
        />
      ))}
    </div>
  );
}

function ContextChip({
  context,
  active,
  onSelect,
}: {
  context: HomeContext;
  active: boolean;
  onSelect?: () => void;
}) {
  const Icon = CONTEXT_ICONS[context.id] ?? Users;

  return (
    <Link
      href={`/home?context=${context.id}`}
      scroll={false}
      role="tab"
      aria-selected={active}
      onClick={(event) => {
        if (!onSelect) return;
        event.preventDefault();
        onSelect();
      }}
      className={cn(
        "touch-manipulation flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-[16px] border px-1.5 py-3 transition-all active:scale-[0.97]",
        active
          ? "border-sai-primary bg-sai-primary text-white shadow-[0_8px_24px_rgba(145,129,244,0.35)]"
          : "border-[#E8E8ED] bg-sai-surface text-sai-text shadow-[0_2px_10px_rgba(45,49,66,0.04)]"
      )}
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-[12px]",
          active ? "bg-white/20" : "bg-[#F4F4F8]"
        )}
      >
        <Icon
          className={cn("size-5", active ? "text-white" : "text-sai-text-secondary")}
          strokeWidth={2}
        />
      </span>
      <span className="text-[11px] font-bold leading-tight">{context.label}</span>
    </Link>
  );
}
