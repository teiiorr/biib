import { fmt } from "./geometry";

export interface ChustCell {
  readonly x: number;
  readonly arch: string;
  readonly accent: string;
}

export interface ChustBand {
  readonly width: number;
  readonly height: number;
  readonly cells: readonly ChustCell[];
}

/**
 * Chust doʻppisi hoshiyasi: 16 ta uchli (ogee) ravoqcha, har birining ichida bitta bodomcha.
 * Ravoqcha ikki S-egri bilan quriladi: yonlari qavariq, tepasi botiq, uchi oʻtkir.
 */
export function chustArchPath(x: number, w: number, h: number, inset = 0): string {
  const left = x + inset;
  const right = x + w - inset;
  const width = right - left;
  const top = inset;
  const bottom = h - inset;
  const mid = left + width / 2;
  return [
    `M${fmt(left)} ${fmt(bottom)}`,
    `C${fmt(left)} ${fmt(bottom - (bottom - top) * 0.55)} ${fmt(left + width * 0.28)} ${fmt(top + (bottom - top) * 0.42)} ${fmt(mid)} ${fmt(top)}`,
    `C${fmt(right - width * 0.28)} ${fmt(top + (bottom - top) * 0.42)} ${fmt(right)} ${fmt(bottom - (bottom - top) * 0.55)} ${fmt(right)} ${fmt(bottom)}`,
  ].join(" ");
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

export function chustBand(count = 16, cellWidth = 40, cellHeight = 30): ChustBand {
  const cells: ChustCell[] = Array.from({ length: count }, (_, i) => {
    const x = i * cellWidth;
    const cx = x + cellWidth / 2;
    const bodomH = cellHeight * 0.34;
    const bodomW = cellWidth * 0.16;
    const top = cellHeight * 0.4;
    const accent = [
      `M${fmt(cx)} ${fmt(top)}`,
      `C${fmt(cx + bodomW)} ${fmt(top + bodomH * 0.35)} ${fmt(cx + bodomW * 0.7)} ${fmt(top + bodomH)} ${fmt(cx)} ${fmt(top + bodomH * 1.05)}`,
      `C${fmt(cx - bodomW * 0.7)} ${fmt(top + bodomH)} ${fmt(cx - bodomW)} ${fmt(top + bodomH * 0.35)} ${fmt(cx)} ${fmt(top)}`,
      "Z",
    ].join(" ");
    return { x, arch: chustArchPath(x, cellWidth, cellHeight, 2), accent };
  });
  return { width: count * cellWidth, height: cellHeight, cells };
}
