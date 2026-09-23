import { MEDIA } from "./constants";

export type Breakpoint = "compact" | "medium" | "expanded";

export interface MotionPrefs {
  /** prefers-reduced-motion: reduce. */
  readonly reduced: boolean;
  /** Koʻrinish panelidagi Harakat tugmasi (<html data-motion="off">). */
  readonly motionOff: boolean;
  readonly isTouch: boolean;
  readonly breakpoint: Breakpoint;
  /** Brauzerda oʻqilgunga qadar false; SSR va birinchi render bir xil. */
  readonly ready: boolean;
}

/** Server va gidratsiya bir xil boʻlishi uchun neytral boshlangʻich holat. */
export const INITIAL_PREFS: MotionPrefs = {
  reduced: false,
  motionOff: false,
  isTouch: false,
  breakpoint: "expanded",
  ready: false,
};

export function isMotionOff(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-motion") === "off";
}

export function readBreakpoint(): Breakpoint {
  if (typeof window === "undefined") return INITIAL_PREFS.breakpoint;
  if (window.matchMedia(MEDIA.expanded).matches) return "expanded";
  if (window.matchMedia(MEDIA.medium).matches) return "medium";
  return "compact";
}

export function readMotionPrefs(): MotionPrefs {
  if (typeof window === "undefined") return INITIAL_PREFS;
  return {
    reduced: window.matchMedia(MEDIA.reduced).matches,
    motionOff: isMotionOff(),
    isTouch: window.matchMedia(MEDIA.touch).matches,
    breakpoint: readBreakpoint(),
    ready: true,
  };
}

/** Choreografiya ishga tushishi mumkinmi: ikkala cheklov ham yoʻq boʻlsa. */
export function motionAllowed(prefs: Pick<MotionPrefs, "reduced" | "motionOff">): boolean {
  return !prefs.reduced && !prefs.motionOff;
}

/** React tashqarisidagi kod ham tekshira olishi uchun. */
export function motionAllowedNow(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia(MEDIA.reduced).matches && !isMotionOff();
}
