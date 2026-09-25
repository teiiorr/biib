import { fmt } from "./geometry";

export interface ChustCell {
  readonly arch: string;
  readonly pod: string;
}

/**
 * Past toʻrt markazli ravoq (Chust doʻppisi hoshiyasi, §11.1 usuli): tovon yonida ikkita kichik
 * aylana (r1), tepada ikkita katta aylana, uchida yumshoq burchak. Katta aylana markazi oʻqdan
 * oʻngda va tovon chizigʻidan pastda: kichik aylanaga ichkaridan urinadi va uchdan oʻtadi.
 * Gumbaz emas: balandlik kenglikning ¼ idan kam, yonlari tik koʻtarilmaydi.
 */
export function fourCentredArch(
  x: number,
  base: number,
  width: number,
  rise: number,
  springRatio = 0.2,
  shiftRatio = 0.1,
): string {
  const r1 = width * springRatio;
  const cx = width / 2 + width * shiftRatio;
  const a = width / 2 - cx;
  const b = cx - r1;
  const radiusAt = (cy: number): number =>
    (a * a + rise * rise - 2 * rise * cy - b * b + r1 * r1) / (2 * r1);
  const miss = (cy: number): number => radiusAt(cy) ** 2 - (a * a + (rise - cy) ** 2);
  // Katta aylana markazining balandligi: ikki shart bitta tenglamaga keladi, ikkiga boʻlish bilan yechiladi.
  let lo = -width * 10;
  let hi = 0;
  const loSign = Math.sign(miss(lo));
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (Math.sign(miss(mid)) === loSign) lo = mid;
    else hi = mid;
  }
  const cy = (lo + hi) / 2;
  const radius = radiusAt(cy);
  const dx = r1 - cx;
  const dy = -cy;
  const d = Math.hypot(dx, dy);
  const tx = r1 + (dx / d) * r1;
  const ty = (dy / d) * r1;
  const X = (v: number): string => fmt(x + v);
  const Y = (v: number): string => fmt(base - v);
  return [
    `M${X(0)} ${Y(0)}`,
    `A${fmt(r1)} ${fmt(r1)} 0 0 1 ${X(tx)} ${Y(ty)}`,
    `A${fmt(radius)} ${fmt(radius)} 0 0 1 ${X(width / 2)} ${Y(rise)}`,
    `A${fmt(radius)} ${fmt(radius)} 0 0 1 ${X(width - tx)} ${Y(ty)}`,
    `A${fmt(r1)} ${fmt(r1)} 0 0 1 ${X(width)} ${Y(0)}`,
  ].join(" ");
}

/** Ravoq ichidagi qalampir: faqat chiziq, uchi pastga, bandi tepada (toʻldirish yoʻq). */
export function hangingPod(cx: number, top: number, w: number, h: number): string {
  const x = (t: number): string => fmt(cx - w / 2 + t * w);
  const y = (t: number): string => fmt(top + t * h);
  return [
    `M${x(0.5)} ${y(0.1)}`,
    `C${x(0.95)} ${y(0.16)} ${x(1)} ${y(0.6)} ${x(0.62)} ${y(1)}`,
    `C${x(0.46)} ${y(0.84)} ${x(0.05)} ${y(0.56)} ${x(0.16)} ${y(0.22)}`,
    `C${x(0.24)} ${y(0.06)} ${x(0.4)} ${y(0.04)} ${x(0.5)} ${y(0.1)}`,
    `M${x(0.5)} ${y(0.1)} C${x(0.52)} ${y(-0.04)} ${x(0.62)} ${y(-0.07)} ${x(0.68)} ${y(-0.03)}`,
  ].join(" ");
}

/** Bitta katak 64 × 24: ravoq tovonlari katak chetida, qoʻshni ravoq bilan bir nuqtada tutashadi. */
export const CHUST_CELL = { width: 64, height: 24 } as const;

export function chustCell(): ChustCell {
  const { width, height } = CHUST_CELL;
  return {
    arch: fourCentredArch(0, height - 0.5, width, 16),
    pod: hangingPod(width / 2, 12, 6, 9),
  };
}

/** Qalampir: egilgan qizil qalampir tanasi va kichik bandi; toʻldirish yuqoridan boshlanadi. */
export function qalampirPath(w: number, h: number): string {
  return [
    `M${fmt(w * 0.5)} ${fmt(h * 0.08)}`,
    `C${fmt(w * 0.92)} ${fmt(h * 0.14)} ${fmt(w * 1.02)} ${fmt(h * 0.58)} ${fmt(w * 0.62)} ${fmt(h * 0.98)}`,
    `C${fmt(w * 0.5)} ${fmt(h * 0.86)} ${fmt(w * 0.06)} ${fmt(h * 0.56)} ${fmt(w * 0.18)} ${fmt(h * 0.2)}`,
    `C${fmt(w * 0.26)} ${fmt(h * 0.04)} ${fmt(w * 0.42)} ${fmt(h * 0.02)} ${fmt(w * 0.5)} ${fmt(h * 0.08)}`,
    "Z",
    `M${fmt(w * 0.5)} ${fmt(h * 0.08)} C${fmt(w * 0.52)} ${fmt(-h * 0.04)} ${fmt(w * 0.62)} ${fmt(-h * 0.06)} ${fmt(w * 0.66)} ${fmt(-h * 0.02)}`,
  ].join(" ");
}
