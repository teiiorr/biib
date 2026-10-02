/** Faqat shu nisbatlar ishlatiladi. */
export const ASPECT_RATIOS = {
  "4:5": [4, 5],
  "3:2": [3, 2],
  "16:9": [16, 9],
  "1:1": [1, 1],
  "3:4": [3, 4],
} as const satisfies Record<string, readonly [number, number]>;

export type AspectRatio = keyof typeof ASPECT_RATIOS;

export function ratioCss(ratio: AspectRatio): string {
  const [w, h] = ASPECT_RATIOS[ratio];
  return `${w} / ${h}`;
}
