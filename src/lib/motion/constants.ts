/** Kadr byudjeti (§14.5, §17): testlar shu qiymatlarni oʻlchaydi. */
export const FRAME_BUDGET = {
  /** 60 fps da bitta kadr, ms. */
  frameMs: 16.7,
  /** Yuklanishdan keyin ruxsat etilgan eng uzun vazifa, ms. */
  longTaskMs: 50,
  /** Skriptli skrollda byudjetga sigʻishi shart boʻlgan kadrlar ulushi. */
  minFrameShare: 0.95,
} as const;

export const FRAME_BUDGET_MS = FRAME_BUDGET.frameMs;

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
export const AMBIENT = {
  minLoopS: 6,
  maxLoopS: 16,
  minCycleS: 4,
} as const;

/** Doira usuli birligi, s (90 ms). */
export const DOIRA_UNIT = 0.09;

/** Parallaks qatlamlarining sukut boʻyicha yurish masofasi, px. */
export const DEPTH_RANGE = 120;

/** Faqat kompozitorga qulay xususiyatlar animatsiya qilinadi. */
export const COMPOSITOR_PROPS = ["transform", "opacity", "clip-path", "filter"] as const;
export type CompositorProp = (typeof COMPOSITOR_PROPS)[number];
