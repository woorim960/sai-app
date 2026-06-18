"use client";

import Link from "next/link";
import { Bolt, Laugh, MessageCircle } from "lucide-react";

const QUICK_THEMES = [
  { href: "/games?filter=quick", label: "5분 게임", icon: Bolt },
  { href: "/games?filter=deep", label: "깊은 대화", icon: MessageCircle },
  { href: "/games?filter=popular", label: "웃긴/인기", icon: Laugh },
];

type HomeQuickThemeChipsProps = {
  onThemeClick?: (themeLabel: string) => void;
};

export function HomeQuickThemeChips({ onThemeClick }: HomeQuickThemeChipsProps) {
  return (
    <section className="mt-4 px-5" aria-label="빠른 테마">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {QUICK_THEMES.map((theme) => {
          const Icon = theme.icon;
          return (
            <Link
              key={theme.label}
              href={theme.href}
              onClick={() => onThemeClick?.(theme.label)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#E8E8ED] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#565666] shadow-[0_1px_8px_rgba(45,49,66,0.04)] transition-all active:scale-[0.97]"
            >
              <Icon className="size-3.5 text-sai-primary" strokeWidth={2.2} />
              {theme.label}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
