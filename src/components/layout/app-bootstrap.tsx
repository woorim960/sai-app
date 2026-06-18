"use client";

import { useLayoutEffect } from "react";
import { getClientId } from "@/lib/client-id";
import { isOnboardingComplete, syncOnboardingCookie } from "@/lib/storage";

/** next/script·네이티브 script 대신 useLayoutEffect — React 19 하이드레이션 오류 방지 */
export function AppBootstrap() {
  useLayoutEffect(() => {
    getClientId();

    if (!isOnboardingComplete()) return;

    syncOnboardingCookie();
    const path = window.location.pathname;
    if (path === "/" || path === "/onboarding") {
      window.location.replace("/home");
    }
  }, []);

  return null;
}
