import { getEngine } from "@/components/motion/engine";

let pending = false;
let fontsHooked = false;

/** Bir kadrda bitta qayta hisoblash; dvigatel boʻlmasa hisoblanadigan narsa ham yoʻq. */
export function scheduleScrollRefresh(): void {
  if (pending || typeof window === "undefined" || !getEngine()) return;
  pending = true;
  window.requestAnimationFrame(() => {
    pending = false;
    getEngine()?.ScrollTrigger.refresh();
  });
}

/** Qahramon media (poster, shader, video) oʻlchamini olgach sahifa quruvchisi chaqiradi. */
export function notifyHeroReady(): void {
  scheduleScrollRefresh();
}

/** Shriftlar kelganda oʻlchamlar oʻzgaradi; tinglovchi bir marta ulanadi. */
export function refreshAfterFonts(): void {
  if (fontsHooked || typeof document === "undefined") return;
  fontsHooked = true;
  const fonts = document.fonts as FontFaceSet | undefined;
  if (!fonts) return;
  void fonts.ready.then(scheduleScrollRefresh);
}
