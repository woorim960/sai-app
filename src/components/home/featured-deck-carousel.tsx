"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  getHomeFeaturedDecks,
  type HomeDeckPresentation,
} from "@/lib/data/home";
import { cn } from "@/lib/utils";

function FeaturedSlide({
  item,
  ctaLabel,
  onClick,
}: {
  item: HomeDeckPresentation;
  ctaLabel: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={`/decks/${item.deckId}`}
      onClick={onClick}
      className={cn(
        "relative flex h-[188px] w-full shrink-0 snap-center items-center gap-3 overflow-hidden rounded-[24px] bg-gradient-to-br p-5 text-white shadow-[0_12px_32px_rgba(145,129,244,0.30)] transition-transform active:scale-[0.99]",
        item.gradientClass
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-white/15"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-14 right-8 size-32 rounded-full bg-white/10"
      />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col self-stretch">
        <span className="inline-flex w-fit rounded-full bg-white/25 px-3 py-1 text-[11px] font-semibold backdrop-blur-sm">
          {item.tagLabel}
        </span>
        <h3 className="mt-3 text-[22px] font-bold leading-tight tracking-[-0.02em]">
          {item.displayTitle}
        </h3>
        <p className="mt-1.5 text-[13px] font-medium leading-snug text-white/90">
          {item.displaySubtitle}
        </p>
        <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-sai-text shadow-[0_4px_14px_rgba(0,0,0,0.12)]">
          {ctaLabel}
          <ChevronRight className="size-4" strokeWidth={2.6} />
        </span>
      </div>

      <div
        aria-hidden
        className="relative z-10 flex size-[92px] shrink-0 items-center justify-center rounded-[28px] bg-white/20 text-[46px] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-md"
      >
        {item.illustration}
        {item.bubbleText && (
          <span className="absolute -right-2 -top-2 flex min-h-7 min-w-7 items-center justify-center rounded-full bg-white px-1.5 text-[12px] font-bold text-sai-primary shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            {item.bubbleText}
          </span>
        )}
      </div>
    </Link>
  );
}

type FeaturedDeckCarouselProps = {
  contextId: string;
  variant?: "A" | "B";
  onFeaturedClick?: (deckId: string) => void;
};

export function FeaturedDeckCarousel({
  contextId,
  variant = "A",
  onFeaturedClick,
}: FeaturedDeckCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = useMemo(
    () => getHomeFeaturedDecks(contextId),
    [contextId]
  );

  useEffect(() => {
    setSlideIndex(0);
    scrollRef.current?.scrollTo({ left: 0 });
  }, [contextId]);

  const activeIndex =
    slides.length > 0 ? Math.min(slideIndex, slides.length - 1) : 0;

  if (slides.length === 0) {
    return (
      <section className="mt-8 px-5" aria-label="지금 하기 좋은 게임">
        <h2 className="text-[17px] font-bold text-sai-text">지금 하기 좋은 게임</h2>
        <p className="mt-4 rounded-[20px] bg-sai-surface px-4 py-8 text-center text-[14px] text-sai-text-secondary shadow-[0_2px_12px_rgba(45,49,66,0.05)]">
          이 상황에 맞는 추천 게임이 없어요.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-7" aria-label="지금 하기 좋은 게임">
      <h2 className="px-5 text-[17px] font-bold text-sai-text">
        지금 하기 좋은 게임
      </h2>

      <div
        ref={scrollRef}
        className="hide-scrollbar mt-3.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5"
        onScroll={(event) => {
          const target = event.currentTarget;
          const firstChild = target.firstElementChild as HTMLElement | null;
          if (!firstChild) return;
          const cardWidth = firstChild.offsetWidth + 12;
          const index = Math.round(target.scrollLeft / cardWidth);
          if (index !== slideIndex && index >= 0 && index < slides.length) {
            setSlideIndex(index);
          }
        }}
      >
        {slides.map((item) => (
          <div key={item.deckId} className="w-[calc(100vw-2.5rem)] max-w-[390px] shrink-0 snap-center">
            <FeaturedSlide
              item={item}
              ctaLabel={variant === "B" ? "바로 시작" : "시작하기"}
              onClick={() => onFeaturedClick?.(item.deckId)}
            />
          </div>
        ))}
      </div>

      <div className="mt-3.5 flex items-center justify-center gap-1.5">
        {slides.map((item, index) => (
          <button
            key={item.deckId}
            type="button"
            aria-label={`${index + 1}번째 추천 게임`}
            aria-current={index === activeIndex}
            onClick={() => {
              const firstChild = scrollRef.current?.firstElementChild as
                | HTMLElement
                | null;
              if (!firstChild || !scrollRef.current) return;
              scrollRef.current.scrollTo({
                left: index * (firstChild.offsetWidth + 12),
                behavior: "smooth",
              });
              setSlideIndex(index);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === activeIndex ? "w-5 bg-sai-primary" : "w-2 bg-[#D8D8DE]"
            )}
          />
        ))}
      </div>
    </section>
  );
}
