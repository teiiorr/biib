/** Doira usuli (§11.12): uchtalik guruh va dam, 90, 90, 180 ms. */
export function doiraDelay(index: number, unit = 0.09): number {
  const group = Math.floor(index / 3);
  const inGroup = index % 3;
  return group * unit * 4 + inGroup * unit;
}

/** gsap `stagger` uchun funksiya: har nishon oʻz indeksiga koʻra doira ritmida kiradi. */
export function doiraStaggerFn(unit = 0.09): (index: number) => number {
  return (index: number) => doiraDelay(index, unit);
}

/**
 * Guruh qanchalik katta boʻlmasin, oxirgi element 1.2 s ichida yoʻlga chiqadi: birlik 90 ms dan
 * kichrayadi (12 ta element uchun ≈ 86 ms), kichik guruhlar odatdagi ritmda qoladi.
 */
export function doiraUnit(count: number, cap = 1.2, unit = 0.09): number {
  const span = doiraDelay(Math.max(0, count - 1), 1);
  return span > 0 ? Math.min(unit, cap / span) : unit;
}
