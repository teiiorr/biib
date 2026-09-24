/** Kadr byudjeti (§14.5, §17): testlar shu qiymatlarni oʻlchaydi. */

/** GSAP uchun sekundlarda; CSS tomoni --dur-* tokenlarida (globals.css). */
export const DURATION = {
  ui: 0.24,
  panel: 0.42,
  reveal: 0.9,
  lines: 1,
  draw: 1.6,
  bloom: 1.4,
  transition: 0.7,
  imageReveal: 0.9,
  /** Kamaytirilgan harakat va View Transitions boʻlmagan brauzerlar uchun. */
  fade: 0.15,
} as const;

export const BREAKPOINT = {
  medium: 600,
  expanded: 1024,
} as const;

/** gsap.matchMedia va MotionProvider bir xil shartlarni ishlatadi. */
export const MEDIA = {
  reduced: "(prefers-reduced-motion: reduce)",
  medium: `(min-width: ${BREAKPOINT.medium}px)`,
  expanded: `(min-width: ${BREAKPOINT.expanded}px)`,
  touch: "(hover: none), (pointer: coarse)",
} as const;

/** Pin uzunligi viewportga nisbatan (§8 XII.5): desktop ≤150 %, mobil ≤100 %. */
export const PIN_LENGTH = {
  expanded: 1.5,
  compact: 1,
} as const;

/** Skrablangan sahnalar shu yumshatish bilan yuradi. */
export const SCRUB = 0.8;

/** Ambient sikllar 6–16 s; hech narsa 4 s dan tez takrorlanmaydi. */

/** Doira usuli birligi, s (90 ms). */

/** Parallaks qatlamlarining sukut boʻyicha yurish masofasi, px. */

/** Faqat kompozitorga qulay xususiyatlar animatsiya qilinadi. */

/** GSAP nomlari; spring-glass dvigatel yaratilganda CustomEase sifatida roʻyxatga olinadi. */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  ui: "power2.out",
  spring: "spring-glass",
} as const;
