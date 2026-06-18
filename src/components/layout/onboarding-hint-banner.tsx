"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { isOnboardingComplete } from "@/lib/storage";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "sai_onboarding_hint_dismissed";

type OnboardingHintBannerProps = {
  className?: string;
};

export function OnboardingHintBanner({ className }: OnboardingHintBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOnboardingComplete()) return;
    if (sessionStorage.getItem(DISMISS_KEY) === "true") return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  };

  return (
    <div
      className={cn(
        "relative rounded-[16px] border border-[#E5E1FA] bg-gradient-to-r from-[#F6F4FF] to-white px-4 py-3.5",
        className
      )}
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="안내 닫기"
        className="absolute right-2.5 top-2.5 rounded-full p-1 text-sai-text-secondary transition-colors hover:bg-black/5"
      >
        <X className="size-3.5" strokeWidth={2.2} />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-sai-primary/10 text-sai-primary">
          <Sparkles className="size-4" strokeWidth={2.2} />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-sai-text">
            사이가 처음이신가요?
          </p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-sai-text-secondary">
            30초 소개를 보면 플레이가 더 쉬워져요. 지금 바로 시작해도 괜찮아요.
          </p>
          <Link
            href="/onboarding"
            className="mt-2 inline-block text-[12px] font-semibold text-sai-primary"
          >
            소개 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
