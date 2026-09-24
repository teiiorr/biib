import { fmt } from "./geometry";
import { ratioParts, type AspectRatio } from "./ratio";
import { between, createRng } from "./seed";

export type CoverTone = "primary" | "secondary";

export interface CoverBand {
  readonly tone: CoverTone;
  readonly d: string;
  readonly opacity: number;
}

export interface CoverMotif {
  readonly kind: "star" | "bud";
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly angle: number;
}

export interface CoverComposition {
  readonly width: number;
  readonly height: number;
  readonly bands: readonly CoverBand[];
  readonly motif: CoverMotif;
}

/**
 * Abr (ikat) tasmalari: vertikal tanda yoʻllari, boʻyoq cheti pogʻonali (har tasma alohida
 * boʻyoq vannasi). Pogʻona balandligi 6–14 px, siljish ±2–5 px, hammasi urugʻdan.
 * Ustiga bitta girih yulduzi yoki islimiy kurtagi — muqova hech qachon boʻsh emas.
 */
export function coverComposition(ratio: AspectRatio, seed: string | number): CoverComposition {
  const [rw, rh] = ratioParts(ratio);
  const width = 480;
  const height = Math.round((width * rh) / rw);
  const rng = createRng(`${ratio}:${seed}`);
  const bands: CoverBand[] = [];
  const count = 4 + Math.floor(rng() * 3);
  let x = -between(rng, 10, 40);
  for (let i = 0; i < count && x < width; i += 1) {
    const w = between(rng, width * 0.08, width * 0.22);
    const tone: CoverTone = i % 2 === 0 ? "primary" : "secondary";
    bands.push({ tone, d: steppedBand(x, w, height, rng), opacity: between(rng, 0.55, 0.9) });
    x += w + between(rng, width * 0.04, width * 0.14);
  }
  const kind = rng() < 0.5 ? "star" : "bud";
  const size = Math.min(width, height) * between(rng, 0.28, 0.38);
  const motif: CoverMotif = {
    kind,
    x: between(rng, width * 0.3, width * 0.7),
    y: between(rng, height * 0.3, height * 0.7),
    size,
    angle: kind === "bud" ? between(rng, -40, 20) : 0,
  };
  return { width, height, bands, motif };
}

function steppedBand(x: number, w: number, h: number, rng: ReturnType<typeof createRng>): string {
  /* 12–24 px pogʻona: abr chetlari koʻrinishda bir xil, yoʻl uzunligi ikki barobar qisqa. */
  const step = between(rng, 12, 24);
  const drift = between(rng, 2, 5);
  const left: string[] = [];
  const right: string[] = [];
  for (let y = 0; y <= h + step; y += step) {
    const jitterL = Math.round(between(rng, -drift, drift));
    const jitterR = Math.round(between(rng, -drift, drift));
    left.push(`${fmt(x + jitterL)} ${fmt(y)}`);
    right.push(`${fmt(x + w + jitterR)} ${fmt(y)}`);
  }
  const down = left.map((p, i) => `${i === 0 ? "M" : "V"}${p.split(" ")[1]} H${p.split(" ")[0]}`);
  const up = right.reverse().map((p) => `V${p.split(" ")[1]} H${p.split(" ")[0]}`);
  const startX = left[0]?.split(" ")[0] ?? fmt(x);
  return `M${startX} 0 ${down.slice(1).join(" ")} ${up.join(" ")} Z`;
}
