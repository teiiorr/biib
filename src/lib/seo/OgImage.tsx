import type { Locale } from "@/i18n/locales";

/* Satori CSS oʻzgaruvchilarini bilmaydi: shu sabab tokenlar bu yerda oʻzgarmas qiymat. */
const ATLAS = {
  bg: "#f7f3ea",
  ink: "#0e1733",
  ink2: "#3a4466",
  tint: "#b8306a",
  gold: "#c9a646",
  goldText: "#7a5c1a",
};

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** Oʻn qirrali girih yulduzi: ikki beshburchakning kesishmasi. */
function starPath(cx: number, cy: number, outer: number, inner: number): string {
  const points: string[] = [];
  for (let i = 0; i < 20; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 10) * i - Math.PI / 2;
    points.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${points.join("L")}Z`;
}

export interface OgImageProps {
  readonly locale: Locale;
  readonly title: string;
  readonly topic: string;
}

export function ogAlt(topic: string, title: string): string {
  return `${topic}: ${title}`;
}

export function OgImage({ title, topic }: OgImageProps) {
  const size = title.length > 48 ? 56 : title.length > 28 ? 68 : 84;
  return (
    <div
      style={{
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: ATLAS.bg,
        color: ATLAS.ink,
        fontFamily: "Manrope",
        position: "relative",
      }}
    >
      <svg
        width="360"
        height="360"
        viewBox="0 0 360 360"
        style={{ position: "absolute", right: -60, top: -60, opacity: 0.9 }}
      >
        <path d={starPath(180, 180, 170, 66)} fill="none" stroke={ATLAS.gold} strokeWidth="2" />
        <path d={starPath(180, 180, 120, 46)} fill="none" stroke={ATLAS.gold} strokeWidth="1.5" />
        <path d={starPath(180, 180, 60, 24)} fill={ATLAS.tint} stroke="none" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 26, color: ATLAS.goldText, letterSpacing: 1 }}>{topic}</div>
        <div
          style={{
            display: "flex",
            width: 820,
            fontSize: size,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: -0.02 * size,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `2px solid ${ATLAS.gold}`,
          paddingTop: 24,
          fontSize: 24,
          color: ATLAS.ink2,
        }}
      >
        <div style={{ display: "flex" }}>Bolalar Ijodkorligi Ijodiy Birlashmasi</div>
        <div style={{ display: "flex", color: ATLAS.tint }}>biib-chi.vercel.app</div>
      </div>
    </div>
  );
}
