/** Kadr byudjeti: testlar shu qiymatlarni oʻlchaydi. */

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

/** Mahkamlangan sahna uzunligi ekran balandligiga nisbatan. */
export const PIN_LENGTH = {
  expanded: 1.5,
  compact: 1,
} as const;

export const SCRUB = 0.8;

/** Ekran balandligiga nisbatan; CSS --hero-scene-length bilan bir xil, PIN_LENGTH qiymatidan oshmaydi. */
export const SCENE_LENGTH = {
  hero: { expanded: 0.8, compact: 0.6 },
} as const;

/**
 * CSS tokenlari bilan bir xil egri chiziqlar: dvigatel yaratilganda CustomEase sifatida roʻyxatga
 * olinadi (gsap.ts), shunda CSS oʻtishi bilan tween farq qilmaydi.
 */
export const EASE = {
  out: "out",
  inOut: "in-out",
  ui: "ui",
  spring: "spring-glass",
  none: "none",
} as const;

/** Faqat aniq koʻrsatkichda ishlaydi (sichqoncha, sensorli panel). */
export const MAGNET = { max: 6, icon: 4, strength: 0.35, inner: 0.4 } as const;

/** Media balandligiga nisbatan; tor ekranda chuqurlik kamroq. */
export const PARALLAX = { expanded: 0.08, compact: 0.05 } as const;

/** Dvigatel gidratsiyadan keyin koʻpi bilan shuncha ms kutadi, foydalanuvchi niyati boʻlsa undan oldin. */
export const ENGINE_IDLE_TIMEOUT = 800;
