import { NextResponse } from "next/server";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export function groupJsonResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: NO_STORE_HEADERS });
}

export function groupErrorResponse(
  error: string,
  status: number
): NextResponse {
  return NextResponse.json({ error }, { status, headers: NO_STORE_HEADERS });
}
