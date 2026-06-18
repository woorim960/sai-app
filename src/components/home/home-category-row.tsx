import Link from "next/link";
import { HOME_CATEGORIES } from "@/lib/data/home";

export function HomeCategoryRow() {
  return (
    <section className="mt-9 px-5" aria-label="카테고리">
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-sai-text">카테고리</h2>
        <Link
          href="/games"
          className="text-[13px] font-medium text-sai-text-secondary"
        >
          전체보기 &gt;
        </Link>
      </div>

      <div className="hide-scrollbar mt-4 flex gap-3.5 overflow-x-auto pb-1">
        {HOME_CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="flex w-[68px] shrink-0 flex-col items-center gap-2 transition-transform active:scale-[0.96]"
          >
            <span
              className={`flex size-[58px] items-center justify-center rounded-[18px] text-[24px] shadow-[0_2px_10px_rgba(45,49,66,0.05)] ${category.bgClass}`}
            >
              {category.emoji}
            </span>
            <span className="whitespace-nowrap text-center text-[10px] font-bold leading-tight text-sai-text">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
