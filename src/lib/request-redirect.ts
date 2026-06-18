import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function resolveRequestOrigin(request: NextRequest): string {
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host") ||
    request.nextUrl.host;
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    request.nextUrl.protocol.replace(":", "") ||
    "http";

  return `${proto}://${host}`;
}

/**
 * Next.js 16 redirect는 절대 URL만 허용합니다.
 * Host 헤더(브라우저가 실제 접속한 IP/도메인)를 써서 origin을 맞춥니다.
 */
export function redirectToPath(
  request: NextRequest,
  pathname: string,
  status: 307 | 308 = 307
): NextResponse {
  const destination = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const absolute = `${resolveRequestOrigin(request)}${destination}`;
  return NextResponse.redirect(absolute, status);
}
