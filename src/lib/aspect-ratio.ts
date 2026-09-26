/** Ruxsat etilgan nisbatlar (§8 X.3): boshqasi yoʻq. */
export const ASPECT_RATIOS = {
  "4:5": [4, 5],
  "3:2": [3, 2],
  "16:9": [16, 9],
  "1:1": [1, 1],
  "3:4": [3, 4],
} as const satisfies Record<string, readonly [number, number]>;

export type AspectRatio = keyof typeof ASPECT_RATIOS;

/** CSS aspect-ratio qiymati: "4 / 5". */
export function ratioCss(ratio: AspectRatio): string {
  const [w, h] = ASPECT_RATIOS[ratio];
  return `${w} / ${h}`;
}
