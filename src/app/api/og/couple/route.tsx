import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") ?? "95";
  const headline = searchParams.get("headline") ?? "우리의 궁합";
  const aTitle = searchParams.get("a") ?? "";
  const bTitle = searchParams.get("b") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #8B7CFF 0%, #B6A9FF 45%, #FFB6D2 100%)",
          fontFamily: "system-ui, sans-serif",
          color: "#FFFFFF",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.08em",
            opacity: 0.9,
          }}
        >
          사이 · 연애 궁합
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            marginTop: 8,
          }}
        >
          <div style={{ fontSize: 220, fontWeight: 800, lineHeight: 1 }}>
            {score}
          </div>
          <div
            style={{
              fontSize: 90,
              fontWeight: 800,
              marginBottom: 28,
              marginLeft: 6,
            }}
          >
            %
          </div>
        </div>

        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 4 }}>
          {headline}
        </div>

        {aTitle && bTitle && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 36,
              padding: "16px 32px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.22)",
              fontSize: 32,
              fontWeight: 600,
            }}
          >
            <span>{aTitle}</span>
            <span style={{ opacity: 0.8 }}>×</span>
            <span>{bTitle}</span>
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
