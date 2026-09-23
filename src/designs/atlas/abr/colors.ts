export type Rgb = readonly [number, number, number];

function parseHex(value: string): Rgb | null {
  const hex = value.trim().replace("#", "");
  if (hex.length !== 6) return null;
  const n = Number.parseInt(hex, 16);
  if (Number.isNaN(n)) return null;
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const FALLBACK: Record<string, Rgb> = {
  "--bg": [0.97, 0.95, 0.92],
  "--art-1": [0.84, 0.27, 0.5],
  "--art-2": [0.79, 0.65, 0.27],
  "--art-5": [0.15, 0.38, 0.61],
  "--art-3": [0.18, 0.66, 0.47],
  "--art-4": [0.12, 0.64, 0.65],
};

/** Ranglar tokenlardan oʻqiladi: mavzu almashsa shader ham almashadi. */
export function readSilkColors(): { bg: Rgb; dyes: [Rgb, Rgb, Rgb, Rgb]; night: boolean } {
  const html = document.documentElement;
  const styles = getComputedStyle(html);
  const read = (name: string): Rgb =>
    parseHex(styles.getPropertyValue(name)) ?? FALLBACK[name] ?? [0.5, 0.5, 0.5];
  const night = html.getAttribute("data-theme") === "dark";
  /* Kunduz: pushti, oltin, lojuvard, zumrad; tun: feruza, kobalt, oltin, pushti. */
  const dyes: [Rgb, Rgb, Rgb, Rgb] = night
    ? [read("--art-4"), read("--art-5"), read("--art-2"), read("--art-1")]
    : [read("--art-1"), read("--art-2"), read("--art-5"), read("--art-3")];
  return { bg: read("--bg"), dyes, night };
}
