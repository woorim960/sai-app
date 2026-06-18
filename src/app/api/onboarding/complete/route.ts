import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ONBOARDING_COOKIE } from "@/lib/cookies";

const ONBOARDING_KEY = "sai_onboarding_complete";

/** 온보딩 완료: 쿠키 설정 + localStorage 동기화 후 /home 이동 (JS 미동작 환경 대비) */
export function GET(request: NextRequest) {
  const homeUrl = new URL("/home", request.url);
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>사이 | SAI</title>
</head>
<body>
  <script>
    try {
      localStorage.setItem("${ONBOARDING_KEY}", "true");
    } catch (e) {}
    window.location.replace(${JSON.stringify(homeUrl.pathname)});
  </script>
  <p><a href="${homeUrl.pathname}">홈으로 이동</a></p>
</body>
</html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });

  response.cookies.set(ONBOARDING_COOKIE, "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}
