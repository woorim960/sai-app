import { EntryFlowLayout } from "@/components/layout/entry-flow-layout";
import { onboardingSlides } from "@/lib/data";
import { cn } from "@/lib/utils";

type OnboardingScreenProps = {
  step: number;
};

export function OnboardingScreen({ step }: OnboardingScreenProps) {
  const currentSlide = Math.min(
    Math.max(step, 0),
    onboardingSlides.length - 1
  );
  const isLastSlide = currentSlide === onboardingSlides.length - 1;
  const slide = onboardingSlides[currentSlide];
  const nextHref = isLastSlide
    ? "/api/onboarding/complete"
    : `/onboarding?step=${currentSlide + 2}`;

  return (
    <EntryFlowLayout
      className="page-enter"
      header={
        <>
          <span className="entry-flow-step-pill">
            {currentSlide + 1} / {onboardingSlides.length}
          </span>
          <p className="mt-3 text-[13px] text-sai-text-secondary">
            사이에 오신 것을 환영해요
          </p>
        </>
      }
      footer={
        <div className="space-y-5">
          <div
            className="flex items-center justify-center gap-1.5"
            role="tablist"
            aria-label="온보딩 진행"
          >
            {onboardingSlides.map((item, index) => (
              <span
                key={item.id}
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`${index + 1}번째 슬라이드`}
                className={cn(
                  "entry-flow-dot",
                  index === currentSlide
                    ? "entry-flow-dot--active"
                    : "entry-flow-dot--idle"
                )}
              />
            ))}
          </div>

          <a
            href={nextHref}
            className={cn(
              "touch-manipulation",
              isLastSlide
                ? "compat-btn-primary flex h-14 w-full items-center justify-center rounded-[18px] text-[16px] font-semibold text-white active:scale-[0.98]"
                : "entry-flow-cta-next"
            )}
          >
            {isLastSlide ? "시작하기" : "다음"}
          </a>
        </div>
      }
    >
      <div key={slide.id} className="slide-enter">
        <div className="mb-5 flex justify-center sm:mb-7">
          <div className="entry-flow-icon-card">
            <span aria-hidden className="text-[40px] leading-none">
              {slide.emoji}
            </span>
          </div>
        </div>

        <h1 className="whitespace-pre-line text-[24px] font-bold leading-[1.35] tracking-[-0.03em] text-sai-text sm:text-[26px]">
          {slide.title}
        </h1>
        <p className="mt-4 text-[15px] leading-[1.7] text-sai-text-secondary">
          {slide.description}
        </p>
      </div>
    </EntryFlowLayout>
  );
}
