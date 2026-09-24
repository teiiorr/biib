import { DEG, polylinePath, type Point } from "./geometry";
import type { BudKind } from "./leaves";
import { between, createRng, type Rng } from "./seed";

export interface IslimiyBud {
  readonly kind: BudKind;
  readonly x: number;
  readonly y: number;
  readonly angle: number;
  readonly scale: number;
  /** Oʻsish jarayonida paydo boʻlish nuqtasi, 0–1. */
  readonly at: number;
}

export interface IslimiyStem {
  readonly d: string;
  readonly at: number;
  /** Chizilish davomiyligi umumiy jarayonning ulushi sifatida. */
  readonly span: number;
}

export interface Islimiy {
  readonly width: number;
  readonly height: number;
  readonly stems: readonly IslimiyStem[];
  readonly buds: readonly IslimiyBud[];
}

export interface IslimiyOptions {
  readonly length: number;
  readonly seed: string | number;
  /** Qaysi chetda turadi: chapda spirallar oʻngga (sahifaga) ochiladi. */
  readonly side: "left" | "right";
  readonly width?: number;
}

/**
 * Islimiy: asosiy poya chetdan pastga sekin toʻlqinlanib tushadi; har 70–110 px da
 * logarifmik spiral (r = a·e^{bθ}) shoxlanadi va ichkariga oʻralib kurtakka tugaydi:
 * bodom yoki anor; shox oʻrtasida barg. Hammasi urugʻdan, tasodif yoʻq.
 */
export function islimiyPath(options: IslimiyOptions): Islimiy {
  const width = options.width ?? 96;
  const length = options.length;
  const rng = createRng(options.seed);
  const mirror: 1 | -1 = options.side === "left" ? 1 : -1;
  const spineX = options.side === "left" ? width * 0.24 : width * 0.76;
  const amplitude = width * 0.06;
  const phase = rng() * Math.PI * 2;
  const waves = 1 + Math.floor(length / 360);
  const spineAt = (t: number): Point => ({
    x: spineX + mirror * amplitude * Math.sin(phase + t * Math.PI * 2 * waves),
    y: t * length,
  });
  /* 16 px qadam: egri koʻrinishda silliq, yoʻl uzunligi qisqa. */
  const samples = Math.max(12, Math.round(length / 16));
  const spine = Array.from({ length: samples + 1 }, (_, i) => spineAt(i / samples));
  const stems: IslimiyStem[] = [{ d: polylinePath(spine, false, 1), at: 0, span: 1 }];
  const buds: IslimiyBud[] = [];

  let y = between(rng, 36, 72);
  let index = 0;
  while (y < length - 36) {
    const t = y / length;
    const base = spineAt(t);
    // Shoxlar navbat bilan: sahifa tomonga kattaroq, chet tomonga kichikroq.
    const inward = index % 2 === 0;
    const dir: 1 | -1 = inward === (mirror === 1) ? 1 : -1;
    const reach = inward
      ? between(rng, width * 0.36, width * 0.5)
      : between(rng, width * 0.2, width * 0.28);
    branch(rng, base, dir, reach, t, stems, buds);
    y += between(rng, 70, 110);
    index += 1;
  }
  return { width, height: length, stems, buds };
}

function branch(
  rng: Rng,
  base: Point,
  dir: 1 | -1,
  reach: number,
  at: number,
  stems: IslimiyStem[],
  buds: IslimiyBud[],
): void {
  const turn = between(rng, 210, 330) * DEG;
  const b = between(rng, 0.16, 0.22);
  const a = reach / Math.exp(b * turn);
  // Spiral tashqi nuqtasi poyada, markaz oʻralish tomonida: dir = 1 boʻlsa markaz oʻngda.
  const startAngle = (dir === 1 ? 200 : -20) * DEG + between(rng, -0.3, 0.3);
  const angleAt = (theta: number): number => startAngle + dir * (turn - theta);
  const outer = { x: Math.cos(angleAt(turn)) * reach, y: Math.sin(angleAt(turn)) * reach };
  const center = { x: base.x - outer.x, y: base.y - outer.y };
  const steps = 26;
  const points: Point[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const theta = turn - (turn * i) / steps;
    const r = a * Math.exp(b * theta);
    points.push({
      x: center.x + r * Math.cos(angleAt(theta)),
      y: center.y + r * Math.sin(angleAt(theta)),
    });
  }
  stems.push({ d: polylinePath(points, false, 1), at, span: 0.12 });

  const tip = points[points.length - 1];
  const beforeTip = points[points.length - 2];
  if (tip && beforeTip) {
    const angle = Math.atan2(tip.y - beforeTip.y, tip.x - beforeTip.x) / DEG;
    const kind: BudKind = rng() < 0.28 ? "anor" : "bodom";
    buds.push({ kind, x: tip.x, y: tip.y, angle, scale: reach * 0.42, at: at + 0.06 });
  }
  const mid = points[Math.round(steps * 0.45)];
  const midNext = points[Math.round(steps * 0.45) + 1];
  if (mid && midNext) {
    const tangent = Math.atan2(midNext.y - mid.y, midNext.x - mid.x) / DEG;
    buds.push({
      kind: "barg",
      x: mid.x,
      y: mid.y,
      angle: tangent - dir * 70,
      scale: reach * 0.36,
      at: at + 0.03,
    });
  }
}
