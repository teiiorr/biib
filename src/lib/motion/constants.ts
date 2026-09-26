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

/**
 * Qahramon sahnasi uzunligi viewportga nisbatan (CSS --hero-scene-length bilan bir xil):
 * kompyuter 0.8, telefon 0.6; PIN_LENGTH dan oshmaydi.
 */
export const SCENE_LENGTH = {
  hero: { expanded: 0.8, compact: 0.6 },
} as const;

/**
 * GSAP nomlari CSS tokenlari bilan bir xil egri chiziq: out, in-out, ui va spring-glass dvigatel
 * yaratilganda CustomEase sifatida roʻyxatga olinadi (gsap.ts), CSS oʻtishi va tween farq qilmaydi.
 */
export const EASE = {
  out: "out",
  inOut: "in-out",
  ui: "ui",
  spring: "spring-glass",
  none: "none",
} as const;

/** Magnit tugmalar (faqat aniq koʻrsatkich): koʻpi bilan 6 px, belgili tugmada 4 px; yorliq 40 % ergashadi. */
export const MAGNET = { max: 6, icon: 4, strength: 0.35, inner: 0.4 } as const;

/** Parallaks chuqurligi media balandligiga nisbatan: kompyuterda 8 %, tor ekranda 5 %. */
export const PARALLAX = { expanded: 0.08, compact: 0.05 } as const;

/** Dvigatel gidratsiyadan keyin koʻpi bilan shuncha kutadi (ms), foydalanuvchi niyati undan oldin. */
export const ENGINE_IDLE_TIMEOUT = 800;
