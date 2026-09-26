import type { Locale } from "@/i18n/locales";

/* Satori CSS oʻzgaruvchilarini bilmaydi: shu sabab tokenlar bu yerda oʻzgarmas qiymat. */
const ATLAS = {
  bg: "#f7f3ea",
  ink: "#0e1733",
  ink2: "#3a4466",
  tint: "#b8306a",
  line: "#d9d2c3",
  goldText: "#7a5c1a",
};

export const OG_SIZE = { width: 1200, height: 630 } as const;

export interface OgImageProps {
  readonly locale: Locale;
  readonly title: string;
  readonly topic: string;
}

export function ogAlt(topic: string, title: string): string {
  return `${topic}: ${title}`;
}

export function OgImage({ title, topic }: OgImageProps) {
  /* Sarlavha Unbounded da (saytdagi kabi): keng shrift, eng uzun soʻz ham 820 px ga sigʻishi kerak
     (Satori soʻzni boʻlmaydi) — bir harf ≈ 0.82 em. */
  const longest = Math.max(...title.split(/\s+/).map((word) => word.length));
  const size = Math.min(
    title.length > 48 ? 44 : title.length > 28 ? 54 : 66,
    Math.floor(980 / longest),
  );
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
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 26, color: ATLAS.goldText, letterSpacing: 1 }}>{topic}</div>
        <div
          style={{
            display: "flex",
            width: 820,
            fontFamily: "Unbounded",
            fontSize: size,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -0.01 * size,
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
          borderTop: `2px solid ${ATLAS.line}`,
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
