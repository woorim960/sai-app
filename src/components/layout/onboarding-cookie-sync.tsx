"use client";

import { useLayoutEffect } from "react";
import { syncOnboardingCookie, syncPremiumCookie } from "@/lib/storage";

/** Sync localStorage → cookie before any route guard runs (prevents home/onboarding loop) */
export function OnboardingCookieSync() {
  useLayoutEffect(() => {
    syncOnboardingCookie();
    syncPremiumCookie();
  }, []);

  return null;
}
