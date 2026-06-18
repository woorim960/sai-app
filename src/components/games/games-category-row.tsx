"use client";

import Link from "next/link";
import { HOME_CATEGORIES } from "@/lib/data/home";

export function GamesCategoryRow() {
  return (
    <section className="mt-3" aria-label="카테고리">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-sai-text">카테고리</h2>
        <Link href="/together" className="text-[12px] text-sai-text-secondary">
          둘이하기 &gt;
        </Link>
      </div>

      <div className="hide-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
        {HOME_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="flex w-[64px] shrink-0 flex-col items-center gap-1.5 transition-transform active:scale-[0.96]"
          >
            <span
              className={`flex size-[52px] items-center justify-center rounded-[16px] text-[22px] shadow-[0_2px_10px_rgba(45,49,66,0.05)] ${category.bgClass}`}
            >
              {category.emoji}
            </span>
            <span className="whitespace-nowrap text-[10px] font-bold text-sai-text">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
