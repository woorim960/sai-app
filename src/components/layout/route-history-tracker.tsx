"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordNavigationPath } from "@/lib/navigation/history";

export function RouteHistoryTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.location.search;
    const fullPath = query ? `${pathname}${query}` : pathname;
    recordNavigationPath(fullPath);
  }, [pathname]);

  return null;
}
