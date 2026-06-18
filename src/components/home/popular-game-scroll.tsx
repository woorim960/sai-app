"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, Clock, Flame } from "lucide-react";
import { getHomePopularDecks } from "@/lib/data/home";
import { cn } from "@/lib/utils";

type PopularGameScrollProps = {
  contextId: string;
  onPopularClick?: (deckId: string) => void;
};

export function PopularGameScroll({
  contextId,
  onPopularClick,
}: PopularGameScrollProps) {
  const items = useMemo(() => getHomePopularDecks(contextId), [contextId]);

  return (
    <section className="mt-9 pb-3" aria-label="인기 게임">
      <div className="flex items-end justify-between px-5">
        <div>
          <h2 className="flex items-center gap-1.5 text-[17px] font-bold text-sai-text">
            인기 게임
            <Flame className="size-4 text-[#FF7A59]" strokeWidth={2.4} />
          </h2>
          <p className="mt-1 text-[13px] text-sai-text-secondary">
            지금 가장 많이 즐기는 게임이에요
          </p>
        </div>
        <Link
          href="/games?filter=popular"
          className="flex shrink-0 items-center gap-0.5 text-[13px] font-semibold text-sai-text-secondary transition-colors active:text-sai-primary"
        >
          전체보기
          <ChevronRight className="size-3.5" strokeWidth={2.4} />
        </Link>
      </div>

      <div className="hide-scrollbar mt-4 flex gap-3 overflow-x-auto px-5">
        {items.length === 0 ? (
          <p className="py-8 text-[14px] text-sai-text-secondary">
            이 상황에 맞는 인기 게임이 없어요.
          </p>
        ) : (
          items.map((item, index) => (
            <Link
              key={item.deckId}
              href={`/decks/${item.deckId}`}
              onClick={() => onPopularClick?.(item.deckId)}
              className="group flex w-[150px] shrink-0 flex-col overflow-hidden rounded-[20px] border border-[#EFEFF3] bg-white shadow-[0_4px_18px_rgba(45,49,66,0.06)] transition-all active:scale-[0.98]"
            >
              <div
                className={cn(
                  "relative flex h-[112px] items-center justify-center bg-gradient-to-b",
                  item.gradientClass
                )}
              >
                {index < 3 && (
                  <span className="absolute left-2.5 top-2.5 flex items-center gap-0.5 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-[#FF7A59] backdrop-blur-sm">
                    <Flame className="size-2.5" strokeWidth={2.6} />
                    인기 {index + 1}
                  </span>
                )}
                <span className="text-[46px] leading-none drop-shadow-sm">
                  {item.illustration}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-3">
                <p className="text-[14px] font-bold leading-snug text-sai-text">
                  {item.displayTitle}
                </p>
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-sai-text-secondary">
                  {item.displaySubtitle}
                </p>
                <span className="mt-2.5 inline-flex w-fit items-center gap-1 rounded-full bg-[#F4F4F8] px-2 py-1 text-[11px] font-semibold text-[#565666]">
                  <Clock className="size-3 text-sai-primary" strokeWidth={2.2} />
                  {item.tagLabel}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
