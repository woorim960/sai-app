import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ONBOARDING_COOKIE } from "@/lib/cookies";
import { redirectToPath } from "@/lib/request-redirect";

const ONBOARDING_REQUIRED_PREFIXES = [
  "/home",
  "/games",
  "/together",
  "/browse",
  "/archive",
  "/my",
  "/situations",
];

const PLAY_ENTRY_PREFIXES = [
  "/decks",
  "/group",
  "/invite",
  "/room",
];

function isOnboardingComplete(request: NextRequest): boolean {
  return request.cookies.get(ONBOARDING_COOKIE)?.value === "true";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const onboardingComplete = isOnboardingComplete(request);

  if (pathname === "/onboarding" && onboardingComplete) {
    return redirectToPath(request, "/home");
  }

  const requiresOnboarding = ONBOARDING_REQUIRED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isPlayEntry = PLAY_ENTRY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!requiresOnboarding && !isPlayEntry) {
    return NextResponse.next();
  }

  if (isPlayEntry && !requiresOnboarding) {
    return NextResponse.next();
  }

  if (!onboardingComplete) {
    return redirectToPath(request, "/onboarding");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/onboarding",
    "/home",
    "/games",
    "/together",
    "/together/:path*",
    "/browse",
    "/archive",
    "/my",
    "/situations/:path*",
    "/decks/:path*",
    "/group/:path*",
    "/invite/:path*",
    "/room/:path*",
  ],
};
