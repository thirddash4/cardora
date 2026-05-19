import { ImageResponse } from "next/og";
import { getPublicCard } from "@/lib/template-store";
import { normalizeCardTheme } from "@/lib/card-theme";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WIDTH = 800;
const HEIGHT = 1400; // 4:7 portrait

// Load Instrument Serif italic + Geist from Google fonts.
// We hit the CSS endpoint first to discover the binary URL, then fetch the font file.
async function loadFont(family: string, weight: number, italic = false) {
  // No User-Agent — Google returns a TTF src in that case, which is what Satori needs.
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/\s/g, "+")}:ital,wght@${italic ? 1 : 0},${weight}`;
  const css = await fetch(cssUrl).then((r) => r.text());
  const match = css.match(
    /src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/,
  );
  if (!match)
    throw new Error(
      `Could not parse Google font CSS for ${family} (no TTF/OTF src)`,
    );
  const fontUrl = match[1];
  const buf = await fetch(fontUrl).then((r) => r.arrayBuffer());
  return buf;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ "card-slug": string }> },
) {
  const { "card-slug": slug } = await params;
  const card = await getPublicCard(slug);

  if (!card) {
    return new Response("Not found", { status: 404 });
  }

  const theme = normalizeCardTheme(card.theme);
  const v = card.values;
  const accent = theme.accent;
  const ink = theme.ink;
  const surface = theme.surface;
  const paper = theme.paper;

  const [serifItalic, geistRegular, geistMedium] = await Promise.all([
    loadFont("Instrument Serif", 400, true),
    loadFont("Geist", 400),
    loadFont("Geist", 500),
  ]);

  const contacts = [
    v.email && { icon: "@", label: v.email },
    v.phone && { icon: "↘", label: v.phone },
    v.website && { icon: "↗", label: v.website },
    v.location && { icon: "◎", label: v.location },
  ].filter(Boolean) as Array<{ icon: string; label: string }>;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: ink,
        color: paper,
        padding: 56,
        fontFamily: "Geist",
      }}
    >
      {/* page-wide subtle gradient ambience */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 50% at 15% 12%, ${accent}26, transparent 60%), radial-gradient(50% 40% at 88% 86%, ${accent}14, transparent 60%), linear-gradient(180deg, ${ink}, ${surface})`,
          display: "flex",
        }}
      />

      {/* Card frame */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 44,
          borderRadius: 18,
          border: `1px solid ${paper}1f`,
          background: `linear-gradient(180deg, ${surface}cc, ${ink}66)`,
          boxShadow: `0 60px 120px -40px ${accent}33`,
        }}
      >
        {/* Top row: company + nickname */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                background: accent,
                boxShadow: `0 0 24px ${accent}`,
                display: "flex",
              }}
            />
            <div
              style={{
                fontFamily: "Geist",
                fontWeight: 500,
                fontSize: 22,
                letterSpacing: 5,
                color: paper,
                opacity: 0.6,
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {v.company ?? ""}
            </div>
          </div>
          {v.nickname ? (
            <div
              style={{
                fontFamily: "Geist",
                fontWeight: 500,
                fontSize: 22,
                letterSpacing: 5,
                color: accent,
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {v.nickname}
            </div>
          ) : null}
        </div>

        {/* Name + role */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontFamily: "Instrument Serif",
              fontStyle: "italic",
              fontSize: 100,
              lineHeight: 0.95,
              letterSpacing: -3,
              color: paper,
              textTransform: "lowercase",
              display: "flex",
              flexWrap: "wrap",
              wordBreak: "break-word",
            }}
          >
            {v.name}
          </div>
          <div
            style={{
              fontFamily: "Geist",
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: 5,
              color: accent,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {v.role}
          </div>
        </div>

        {/* Contact list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            color: paper,
            opacity: 0.8,
          }}
        >
          {contacts.map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: 24,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: accent,
                  opacity: 0.6,
                  fontSize: 20,
                }}
              >
                {row.icon}
              </div>
              <div style={{ display: "flex" }}>{row.label}</div>
            </div>
          ))}
        </div>

        {/* Footer mark */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: "Geist",
            fontSize: 16,
            letterSpacing: 4,
            color: paper,
            opacity: 0.35,
            textTransform: "uppercase",
            marginTop: 24,
          }}
        >
          <div style={{ display: "flex" }}>carderna · /c/{card.slug}</div>
          <div style={{ display: "flex" }}>carderna.com</div>
        </div>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Instrument Serif",
          data: serifItalic,
          style: "italic",
          weight: 400,
        },
        { name: "Geist", data: geistRegular, style: "normal", weight: 400 },
        { name: "Geist", data: geistMedium, style: "normal", weight: 500 },
      ],
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=600",
        "Content-Disposition": `attachment; filename="${(v.name ?? card.slug).toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png"`,
      },
    },
  );
}
