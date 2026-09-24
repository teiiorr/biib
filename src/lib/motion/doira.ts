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
