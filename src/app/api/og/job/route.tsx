import { ImageResponse } from "next/og";

export const runtime = "edge";

function clampText(value: string, max: number) {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = clampText(searchParams.get("title") ?? "Job opportunity", 80);
  const company = clampText(searchParams.get("company") ?? "Joocare", 60);
  const location = clampText(searchParams.get("location") ?? "", 60);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B7A75",
          padding: 64,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: 0.2,
            }}
          >
            Joocare
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#FFFFFF",
              maxWidth: 1040,
              wordBreak: "break-word",
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#FFFFFF" }}>{company}</div>
          {location ? (
            <div style={{ fontSize: 26, color: "rgba(255,255,255,0.9)" }}>{location}</div>
          ) : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

