import { fmt } from "./geometry";
import { ratioParts, type RavoqRatio } from "./ratio";

export interface RavoqArch {
  /** Pastki markazlar radiusi (span / 4). */
  readonly r1: number;
  /** Yuqori yoylar radiusi. */
  readonly r2: number;
  /** Ark tepasi va tayanch chizigʻi orasidagi masofa. */
  readonly rise: number;
  readonly springY: number;
  readonly c1: { readonly x: number; readonly y: number };
  readonly c3: { readonly x: number; readonly y: number };
  readonly j1: { readonly x: number; readonly y: number };
}

/** Pastki yoyning burchagi: Temuriylar peshtoqlaridagi qisqa pastki yoy, uzun yuqori yoy. */
const LOWER_SWEEP_DEG = 30;

/**
 * Toʻrt markazli ark (chahor-markaz). Koordinatalar ekran tartibida (y pastga), tepasi (w/2, 0).
 * 1. Tayanch chizigʻi y = rise. Span w toʻrtga boʻlinadi: pastki markazlar C1 = (w/4, rise),
 *    C2 = (3w/4, rise), radius r1 = w/4; yoylar tayanchdan 30° burilib J1, J2 ga yetadi.
 * 2. Yuqori markazlar C3, C4 C1–J1 (C2–J2) chizigʻida, tayanch chizigʻidan pastda: ikki yoy
 *    J da bir-biriga urinma (markazlar va J bir chiziqda).
 * 3. r2 shunday tanlanadiki, yuqori yoy tepadan (w/2, 0) oʻtsin: |A − C3| = r2.
 *    (a − m·cosβ)² + (h + m·sinβ)² = (r1 + m)² ⇒ m = (a² + h² − r1²) / (2(a·cosβ − h·sinβ + r1)),
 *    bu yerda a = w/2 − r1, h = rise, m = r2 − r1. Kvadrat had qisqaradi, yechim yagona.
 * Ikki yuqori yoy tepada burchak hosil qiladi: oʻtkir uchli ark, mehrob emas, darvoza.
 */
export function ravoqArch(width: number, rise: number): RavoqArch {
  const h = Math.min(Math.max(rise, width * 0.25), width * 0.9);
  const r1 = width / 4;
  const beta = (LOWER_SWEEP_DEG * Math.PI) / 180;
  const c = Math.cos(beta);
  const s = Math.sin(beta);
  const a = width / 2 - r1;
  const m = (a * a + h * h - r1 * r1) / (2 * (a * c - h * s + r1));
  const r2 = r1 + m;
  const c1 = { x: r1, y: h };
  const j1 = { x: r1 - r1 * c, y: h - r1 * s };
  const c3 = { x: r1 + m * c, y: h + m * s };
  return { r1, r2, rise: h, springY: h, c1, c3, j1 };
}

/**
 * Portal konturi: pastki chap burchakdan boshlanib, chap tayanch, ikki chap yoy, tepa,
 * ikki oʻng yoy, oʻng tayanch va pastki qirra. `inset` berilsa, xuddi shu markazlar bilan
 * radiuslar kamayadi: doira yoyining parallel egri chizigʻi yana doira yoyi.
 */
export function ravoqPath(width: number, height: number, rise: number, inset = 0): string {
  const arch = ravoqArch(width, rise);
  const r1 = arch.r1 - inset;
  const r2 = arch.r2 - inset;
  const y0 = arch.springY;
  const c1 = arch.c1;
  const beta = (LOWER_SWEEP_DEG * Math.PI) / 180;
  const j1 = { x: c1.x - r1 * Math.cos(beta), y: y0 - r1 * Math.sin(beta) };
  const c3 = arch.c3;
  const half = width / 2;
  const apexY = c3.y - Math.sqrt(Math.max(0, r2 * r2 - (half - c3.x) * (half - c3.x)));
  const j2 = { x: width - j1.x, y: j1.y };
  const left = inset;
  const right = width - inset;
  const bottom = height - inset;
  return [
    `M${fmt(left)} ${fmt(bottom)}`,
    `L${fmt(left)} ${fmt(y0)}`,
    `A${fmt(r1)} ${fmt(r1)} 0 0 1 ${fmt(j1.x)} ${fmt(j1.y)}`,
    `A${fmt(r2)} ${fmt(r2)} 0 0 1 ${fmt(half)} ${fmt(apexY)}`,
    `A${fmt(r2)} ${fmt(r2)} 0 0 1 ${fmt(j2.x)} ${fmt(j2.y)}`,
    `A${fmt(r1)} ${fmt(r1)} 0 0 1 ${fmt(right)} ${fmt(y0)}`,
    `L${fmt(right)} ${fmt(bottom)}`,
    "Z",
  ].join(" ");
}

/** Nisbatga bogʻliq koʻtarilish: 3:4 da span × 0.62, 4:5 da span × 0.56 (tor ramka tikroq). */
export function ravoqRise(width: number, ratio: RavoqRatio): number {
  return width * (ratio === "3:4" ? 0.62 : 0.56);
}

/**
 * clipPathUnits="objectBoundingBox" uchun 0–1 kontur. Doira yoylari x/w, y/h boʻyicha
 * masshtablanadi, shuning uchun ellips yoylar (rx = r/w, ry = r/h) — aniq, taxmin emas.
 */
export function ravoqClipPath(ratio: RavoqRatio): string {
  const [w, h] = ratioParts(ratio);
  const arch = ravoqArch(w, ravoqRise(w, ratio));
  const j1 = arch.j1;
  const j2 = { x: w - j1.x, y: j1.y };
  const n = (x: number, y: number): string => `${fmt(x / w)} ${fmt(y / h)}`;
  const rad = (r: number): string => `${fmt(r / w)} ${fmt(r / h)}`;
  return [
    `M${n(0, h)}`,
    `L${n(0, arch.springY)}`,
    `A${rad(arch.r1)} 0 0 1 ${n(j1.x, j1.y)}`,
    `A${rad(arch.r2)} 0 0 1 ${n(w / 2, 0)}`,
    `A${rad(arch.r2)} 0 0 1 ${n(j2.x, j2.y)}`,
    `A${rad(arch.r1)} 0 0 1 ${n(w, arch.springY)}`,
    `L${n(w, h)}`,
    "Z",
  ].join(" ");
}
