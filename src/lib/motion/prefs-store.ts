import { MEDIA } from "./constants";
import { INITIAL_PREFS, isMotionOff, type MotionPrefs } from "./prefs";

/**
 * Harakat sozlamalari tashqi doʻkon sifatida: media soʻrovlari va <html data-motion>
 * oʻzgarganda bitta yangi obyekt beriladi, useSyncExternalStore uni oʻqiydi.
 */
let cached: MotionPrefs | null = null;
const listeners = new Set<() => void>();
let watching = false;

function compute(): MotionPrefs {
  const reduced = window.matchMedia(MEDIA.reduced).matches;
  const expanded = window.matchMedia(MEDIA.expanded).matches;
  const medium = window.matchMedia(MEDIA.medium).matches;
  return {
    reduced,
    motionOff: isMotionOff(),
    isTouch: window.matchMedia(MEDIA.touch).matches,
    breakpoint: expanded ? "expanded" : medium ? "medium" : "compact",
    ready: true,
  };
}

function same(a: MotionPrefs, b: MotionPrefs): boolean {
  return (
    a.reduced === b.reduced &&
    a.motionOff === b.motionOff &&
    a.isTouch === b.isTouch &&
    a.breakpoint === b.breakpoint
  );
}

function refresh(): void {
  const next = compute();
  if (cached && same(cached, next)) return;
  cached = next;
  listeners.forEach((listener) => listener());
}

function watch(): void {
  if (watching) return;
  watching = true;
  for (const query of Object.values(MEDIA)) {
    window.matchMedia(query).addEventListener("change", refresh);
  }
  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
}

export function subscribeMotionPrefs(listener: () => void): () => void {
  watch();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getMotionPrefs(): MotionPrefs {
  if (typeof window === "undefined") return INITIAL_PREFS;
  cached ??= compute();
  return cached;
}

export function getServerMotionPrefs(): MotionPrefs {
  return INITIAL_PREFS;
}
