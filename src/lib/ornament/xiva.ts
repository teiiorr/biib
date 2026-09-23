import { fmt, polar } from "./geometry";
import { between, createRng, type Rng } from "./seed";

export type XivaVariant = "islimiy" | "girih" | "zanjir" | "band";

export interface XivaColumnGeometry {
  readonly width: number;
  readonly height: number;
  /** Ustun tanasi (toʻldiriladi): kuza asos, tobora torayuvchi tana, muqarnas kapitel. */
  readonly body: string;
  /** Oʻyma chiziqlari (kontur). */
  readonly carvings: readonly string[];
  /** Yorugʻ qirra: chap tomondagi ingichka yorugʻlik chizigʻi. */
  readonly rim: string;
}

const W = 80;
const H = 320;

/**
 * Xiva Juma masjidi ustuni: pastda kuza (koʻzachasimon asos), tana yuqoriga torayadi,
 * tepada pogʻonali muqarnas kapitel. Har variant oʻz oʻyma tili bilan, nisbatlar urugʻdan:
 * 213 ustunning har biri boshqacha boʻlgani kabi.
 */
export function xivaColumn(variant: XivaVariant, seed: string | number): XivaColumnGeometry {
  const rng = createRng(`${variant}:${seed}`);
  const cx = W / 2;
  const bulge = between(rng, 24, 30);
  const neck = between(rng, 12, 15);
  const shaftBottom = between(rng, 16, 19);
  const shaftTop = between(rng, 11, 13);
  const capitalWidth = between(rng, 26, 32);
  const baseTop = H - between(rng, 70, 84);
  const capitalBase = between(rng, 58, 70);

  const body = [
    `M${fmt(cx - 30)} ${fmt(H)}`,
    `L${fmt(cx + 30)} ${fmt(H)}`,
    `L${fmt(cx + 30)} ${fmt(H - 8)}`,
    `C${fmt(cx + bulge)} ${fmt(H - 20)} ${fmt(cx + bulge)} ${fmt(baseTop + 24)} ${fmt(cx + neck)} ${fmt(baseTop)}`,
    `L${fmt(cx + shaftBottom)} ${fmt(baseTop - 10)}`,
    `L${fmt(cx + shaftTop)} ${fmt(capitalBase)}`,
    capitalPath(cx, capitalBase, capitalWidth, shaftTop, rng),
    `L${fmt(cx - shaftTop)} ${fmt(capitalBase)}`,
    `L${fmt(cx - shaftBottom)} ${fmt(baseTop - 10)}`,
    `L${fmt(cx - neck)} ${fmt(baseTop)}`,
    `C${fmt(cx - bulge)} ${fmt(baseTop + 24)} ${fmt(cx - bulge)} ${fmt(H - 20)} ${fmt(cx - 30)} ${fmt(H - 8)}`,
    "Z",
  ].join(" ");

  const carvings = [
    ...baseCarvings(cx, baseTop, bulge, rng),
    ...shaftCarvings(variant, cx, capitalBase + 14, baseTop - 18, shaftTop, shaftBottom, rng),
  ];
  const rim = `M${fmt(cx - shaftBottom + 3)} ${fmt(baseTop - 12)} L${fmt(cx - shaftTop + 3)} ${fmt(capitalBase + 2)}`;
  return { width: W, height: H, body, carvings, rim };
}

/** Muqarnas: 3–4 pogʻona, har biri tashqariga chiqadi va kichik osma uchli. */
function capitalPath(cx: number, base: number, width: number, shaft: number, rng: Rng): string {
  const tiers = rng() < 0.5 ? 3 : 4;
  const parts: string[] = [];
  const step = (width - shaft) / tiers;
  const rise = base / (tiers + 1);
  let x = shaft;
  let y = base;
  for (let i = 0; i < tiers; i += 1) {
    x += step;
    y -= rise;
    parts.push(`L${fmt(cx + x)} ${fmt(y + rise * 0.55)} L${fmt(cx + x)} ${fmt(y)}`);
  }
  parts.push(
    `L${fmt(cx + width)} ${fmt(6)} L${fmt(cx + width)} 0 L${fmt(cx - width)} 0 L${fmt(cx - width)} ${fmt(6)}`,
  );
  let lx = width;
  let ly = y;
  for (let i = 0; i < tiers; i += 1) {
    parts.push(`L${fmt(cx - lx)} ${fmt(ly)} L${fmt(cx - lx)} ${fmt(ly + rise * 0.55)}`);
    lx -= step;
    ly += rise;
  }
  return parts.join(" ");
}

function baseCarvings(cx: number, baseTop: number, bulge: number, rng: Rng): string[] {
  const rings = 2 + Math.floor(rng() * 2);
  const out: string[] = [];
  for (let i = 0; i < rings; i += 1) {
    const y = baseTop + 30 + i * 14;
    const half = bulge * (0.92 - i * 0.04);
    out.push(`M${fmt(cx - half)} ${fmt(y)} Q${fmt(cx)} ${fmt(y + 4)} ${fmt(cx + half)} ${fmt(y)}`);
  }
  return out;
}

function shaftCarvings(
  variant: XivaVariant,
  cx: number,
  top: number,
  bottom: number,
  halfTop: number,
  halfBottom: number,
  rng: Rng,
): string[] {
  const out: string[] = [];
  const halfAt = (y: number): number =>
    halfTop + ((halfBottom - halfTop) * (y - top)) / (bottom - top);
  if (variant === "band") {
    const gap = between(rng, 22, 30);
    for (let y = top + 10; y < bottom; y += gap) {
      const h = halfAt(y) - 3;
      out.push(`M${fmt(cx - h)} ${fmt(y + 5)} L${fmt(cx)} ${fmt(y)} L${fmt(cx + h)} ${fmt(y + 5)}`);
      out.push(
        `M${fmt(cx - h)} ${fmt(y + 11)} L${fmt(cx)} ${fmt(y + 6)} L${fmt(cx + h)} ${fmt(y + 11)}`,
      );
    }
  } else if (variant === "zanjir") {
    const pitch = between(rng, 14, 18);
    for (let y = top + 8; y < bottom - 8; y += pitch) {
      const rx = halfAt(y) * 0.5;
      out.push(
        `M${fmt(cx - rx)} ${fmt(y + pitch / 2)} A${fmt(rx)} ${fmt(pitch * 0.42)} 0 1 1 ${fmt(cx + rx)} ${fmt(y + pitch / 2)} A${fmt(rx)} ${fmt(pitch * 0.42)} 0 1 1 ${fmt(cx - rx)} ${fmt(y + pitch / 2)}`,
      );
    }
  } else if (variant === "girih") {
    const pitch = between(rng, 30, 38);
    for (let y = top + 16; y < bottom - 10; y += pitch) {
      const r = halfAt(y) * 0.62;
      const pts = Array.from({ length: 16 }, (_, i) =>
        polar({ x: cx, y }, i % 2 === 0 ? r : r * 0.5, i * 22.5 - 90),
      );
      out.push(pts.map((p, i) => `${i === 0 ? "M" : "L"}${fmt(p.x)} ${fmt(p.y)}`).join(" ") + " Z");
    }
  } else {
    // Islimiy: ikki spiral ip tana boʻylab bir-biriga chalishib tushadi.
    const waves = Math.round((bottom - top) / between(rng, 40, 52));
    for (const dir of [1, -1]) {
      const parts: string[] = [`M${fmt(cx)} ${fmt(top)}`];
      for (let i = 0; i < waves; i += 1) {
        const y0 = top + ((bottom - top) * i) / waves;
        const y1 = top + ((bottom - top) * (i + 1)) / waves;
        const h = halfAt((y0 + y1) / 2) * 0.66 * dir * (i % 2 === 0 ? 1 : -1);
        parts.push(
          `C${fmt(cx + h)} ${fmt(y0 + (y1 - y0) * 0.2)} ${fmt(cx + h)} ${fmt(y1 - (y1 - y0) * 0.2)} ${fmt(cx)} ${fmt(y1)}`,
        );
      }
      out.push(parts.join(" "));
    }
    for (let i = 1; i < waves; i += 1) {
      const y = top + ((bottom - top) * i) / waves;
      const r = Math.max(2.5, halfAt(y) * 0.2);
      out.push(
        `M${fmt(cx - r)} ${fmt(y)} a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(2 * r)} 0 a${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-2 * r)} 0`,
      );
    }
  }
  return out;
}
