/**
 * Barg, bodom va anor shakllari: Met Open Access (CC0) 20.120.189 (Samarqand muqarnas plitkasi,
 * ikkiga boʻlingan palmetta bargi) va 17.143.3 (Samarqand mozaika plitkasi, bodom va anor
 * boʻrtmalari) konturlaridan kub Bezier bilan yaqinlashtirilgan. Birlik oʻlcham: poyasi (0,0),
 * uchi (1,0) tomonga; joylashtirish translate/rotate/scale bilan.
 */
export type BudKind = "barg" | "bodom" | "anor";

/** Barg: ikki qanotli palmetta, qanotlari poyaga qarab botiq, uchi oʻtkir. */
export function bargPath(): string {
  return [
    "M0 0",
    "C0.18 -0.22 0.42 -0.42 0.66 -0.4",
    "C0.84 -0.38 0.96 -0.18 1 0",
    "C0.96 0.18 0.84 0.38 0.66 0.4",
    "C0.42 0.42 0.18 0.22 0 0",
    "Z",
    "M0.06 0 Q0.5 -0.06 0.9 0",
  ].join(" ");
}

/** Bodom: uchi bir tomonga egilgan qayiqsimon shakl (17.143.3 dagi bodom motivi). */
export function bodomPath(): string {
  return [
    "M0 0",
    "C0.1 -0.34 0.5 -0.46 0.78 -0.3",
    "C0.94 -0.2 1.02 -0.04 0.98 0.06",
    "C0.9 0.1 0.8 0.02 0.72 0.1",
    "C0.5 0.32 0.16 0.3 0 0",
    "Z",
    "M0.1 -0.02 C0.32 -0.2 0.58 -0.24 0.8 -0.12",
  ].join(" ");
}

/** Anor: yumaloq tana, uchida uch tishli toj (17.143.3). Ichida uch dona urugʻ. */
export function anorPath(): string {
  return [
    "M0.08 0",
    "C0.08 -0.3 0.3 -0.42 0.5 -0.42",
    "C0.7 -0.42 0.86 -0.28 0.86 -0.1",
    "L0.94 -0.22 L0.9 -0.06 L1 0 L0.9 0.06 L0.94 0.22 L0.86 0.1",
    "C0.86 0.28 0.7 0.42 0.5 0.42",
    "C0.3 0.42 0.08 0.3 0.08 0",
    "Z",
    "M0.36 -0.1 l0.06 0.06 l-0.06 0.06 l-0.06 -0.06 z",
    "M0.54 -0.16 l0.06 0.06 l-0.06 0.06 l-0.06 -0.06 z",
    "M0.54 0.04 l0.06 0.06 l-0.06 0.06 l-0.06 -0.06 z",
  ].join(" ");
}

export function budPath(kind: BudKind): string {
  if (kind === "barg") return bargPath();
  if (kind === "bodom") return bodomPath();
  return anorPath();
}
