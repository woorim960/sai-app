import { ImageResponse } from "next/og";

export const alt = "사이 | SAI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "linear-gradient(135deg, #FAF8F5 0%, #F3EFFF 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: 32,
            background: "#8576FF",
            color: "#FAF8F5",
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          사
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#1E1E1E",
            letterSpacing: "-0.02em",
          }}
        >
          사이 | SAI
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            color: "#6B6B6B",
            textAlign: "center",
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          더 가까워지고 싶은 사람과 함께 게임하고 대화하며 알아가세요
        </div>
      </div>
    ),
    { ...size }
  );
}
