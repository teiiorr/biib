/** React addTransitionType uchun nomlar; CSS tomonida :active-view-transition-type(). */
export const NAV_FORWARD = "nav-forward";
export const NAV_BACK = "nav-back";
export const LOCALE_SWITCH = "locale-switch";

export const TRANSITION_TYPES = [NAV_FORWARD, NAV_BACK, LOCALE_SWITCH] as const;
export type TransitionType = (typeof TRANSITION_TYPES)[number];
export type NavDirection = typeof NAV_FORWARD | typeof NAV_BACK;

/** View Transitions boʻlmagan brauzerda body ga qoʻyiladigan sinf (transitions.css). */
export const NAV_FADE_CLASS = "nav-fade";

export type SharedKind = "news-cover" | "project-media";

/** Umumiy element nomi: yangilik muqovasi → maqola qahramoni, loyiha kvadranti → boʻlim boshi. */
export function sharedName(kind: SharedKind, slug: string): string {
  const safe = slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  return `${kind}-${safe}`;
}

export function supportsViewTransitions(): boolean {
  if (typeof document === "undefined") return false;
  return typeof document.startViewTransition === "function";
}

function segments(path: string): string[] {
  const clean = path.split(/[?#]/)[0] ?? "";
  return clean.split("/").filter(Boolean);
}

/** Til prefiksi chuqurlikka kirmaydi: /uz/yangiliklar/x va /ru/novosti/x bir xil chuqurlik. */
export function routeDepth(path: string): number {
  return Math.max(0, segments(path).length - 1);
}

/** Oxirgi sahifalar; orqaga qaytishni chuqurlik yolgʻon aytganda ham taniydi. */
const history: string[] = [];
const HISTORY_LIMIT = 24;

export function recordNavigation(path: string): void {
  if (history[history.length - 1] === path) return;
  history.push(path);
  if (history.length > HISTORY_LIMIT) history.shift();
}

/*
 * Bitta element bir marta kiradi: mijoz navigatsiyasida birinchi ekrandagi bloklar oʻz kirishini
 * oʻynamaydi, sahifa oʻtishi (abr) ularning kirishi. Belgi TransitionLink bosilganda qoʻyiladi,
 * PageTransition yangi yoʻlni qayd etgandan bir kadr keyin olib tashlaydi. Oddiy Link va orqaga
 * tugmasi uchun: yangi sahifaning effektlari ishlaganda manzil qayd etilgan yoʻldan farq qiladi.
 */
let navEntry = false;
let committedPath: string | null = null;

export function markNavEntry(): void {
  navEntry = true;
}

export function commitPath(path: string): void {
  committedPath = path;
  window.requestAnimationFrame(() => {
    navEntry = false;
  });
}

export function isNavEntry(): boolean {
  if (navEntry) return true;
  if (committedPath === null || typeof window === "undefined") return false;
  return committedPath !== window.location.pathname;
}

export function inferDirection(from: string, to: string): NavDirection {
  const previous = history[history.length - 2];
  if (previous !== undefined && previous === to) return NAV_BACK;
  return routeDepth(to) < routeDepth(from) ? NAV_BACK : NAV_FORWARD;
}

export function hrefToPath(href: string): string {
  if (typeof window === "undefined") return href;
  try {
    return new URL(href, window.location.href).pathname;
  } catch {
    return href;
  }
}
