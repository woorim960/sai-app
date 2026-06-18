"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EntryFlowLayout } from "@/components/layout/entry-flow-layout";
import { APP_NAME, SPLASH_DURATION_MS } from "@/lib/constants";
import { isOnboardingComplete, syncOnboardingCookie } from "@/lib/storage";
import { cn } from "@/lib/utils";

function getNextPath(): string {
  return isOnboardingComplete() ? "/home" : "/onboarding";
}

export function SplashScreen() {
  const navigatedRef = useRef(false);
  const [redirectMs, setRedirectMs] = useState(SPLASH_DURATION_MS);

  const goNext = useCallback(() => {
    if (navigatedRef.current) return;
    navigatedRef.current = true;

    if (isOnboardingComplete()) {
      syncOnboardingCookie();
    }

    window.location.assign(getNextPath());
  }, []);

  useEffect(() => {
    const delay = isOnboardingComplete() ? 400 : SPLASH_DURATION_MS;
    setRedirectMs(delay);

    const timer = window.setTimeout(goNext, delay);
    return () => window.clearTimeout(timer);
  }, [goNext]);

  return (
    <EntryFlowLayout
      footer={
        <div className="space-y-4">
          <a
            href="/onboarding"
            onClick={(event) => {
              event.preventDefault();
              goNext();
            }}
            className={cn(
              "compat-btn-primary touch-manipulation flex h-14 w-full items-center justify-center rounded-[18px] text-[16px] font-semibold text-white"
            )}
          >
            시작하기
          </a>
          <div className="space-y-2">
            <div
              className="h-1 overflow-hidden rounded-full bg-black/[0.04]"
              aria-hidden
            >
              <div
                className="entry-flow-timer h-full"
                style={{ animationDuration: `${redirectMs}ms` }}
              />
            </div>
            <p className="text-center text-[12px] text-sai-text-secondary/75">
              잠시 후 자동으로 이동해요
            </p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="entry-flow-logo">사</div>
        <h1 className="fade-in-up-delay-1 mt-5 text-[32px] font-bold tracking-[-0.04em] text-sai-text sm:mt-7 sm:text-[36px]">
          {APP_NAME}
        </h1>
        <p className="fade-in-up-delay-2 mt-3 text-[16px] leading-[1.65] text-sai-text-secondary">
          어색한 시간을{" "}
          <span className="font-semibold text-sai-primary">즐거운 시간</span>
          으로
        </p>
      </div>
    </EntryFlowLayout>
  );
}
