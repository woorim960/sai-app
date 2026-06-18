"use client";

import { useLayoutEffect } from "react";
import { SPLASH_DURATION_MS } from "@/lib/constants";
import { isOnboardingComplete } from "@/lib/storage";

export function SplashRedirect() {
  useLayoutEffect(() => {
    if (window.location.pathname !== "/") return;

    const complete = isOnboardingComplete();
    const delay = complete ? 400 : SPLASH_DURATION_MS;
    const target = complete ? "/home" : "/onboarding";

    const timer = window.setTimeout(() => {
      if (window.location.pathname === "/") {
        window.location.replace(target);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
