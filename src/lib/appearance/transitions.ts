import { scheduleScrollRefresh } from "@/lib/motion/refresh";
import { playSound } from "@/lib/sound/play";

import { getAppearanceSnapshot, setAppearance } from "./store";
import type { Design, ThemeChoice } from "./types";

export interface ThemeOrigin {
  readonly x: number;
  readonly y: number;
}

export type TransitionType = "theme-switch" | "design-switch";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

interface ScrollAnchor {
  readonly element: Element;
  readonly top: number;
}

/** Almashishdan keyin skroll pikselga emas, eng yaqin kontent langariga qaytadi. */
function captureAnchor(): ScrollAnchor | null {
  const viewport = window.innerHeight;
  let best: ScrollAnchor | null = null;
  for (const element of document.querySelectorAll("main [id], [id]")) {
    if (element === document.documentElement || element === document.body) continue;
    const rect = element.getBoundingClientRect();
    if (rect.height === 0 || rect.bottom < 0 || rect.top > viewport) continue;
    if (!best || Math.abs(rect.top) < Math.abs(best.top)) best = { element, top: rect.top };
  }
  return best;
}

function restoreAnchor(anchor: ScrollAnchor | null): void {
  if (!anchor || !anchor.element.isConnected) return;
  const delta = anchor.element.getBoundingClientRect().top - anchor.top;
  if (Math.abs(delta) < 1) return;
  window.scrollTo({ top: window.scrollY + delta, behavior: "instant" });
}

function nextTask(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

function runTransition(type: TransitionType, update: () => void | Promise<void>): void {
  const html = document.documentElement;
  const reduced = window.matchMedia(REDUCED_MOTION).matches;
  const className = `vt-${type}`;
  html.classList.add(className);
  if (reduced) html.classList.add("vt-reduced");

  const finish = (): void => {
    html.classList.remove(className, "vt-reduced");
    html.removeAttribute("data-design-to");
    // Boshqa dizaynda bloklar balandligi oʻzgaradi: sahnalar yangi joylashuvni bir marta oʻlchaydi.
    if (type === "design-switch") scheduleScrollRefresh();
  };

  if (typeof document.startViewTransition !== "function") {
    void Promise.resolve(update()).finally(finish);
    return;
  }
  const transition = document.startViewTransition({ update, types: [type] });
  transition.finished.then(finish, finish);
}

export function setTheme(next: ThemeChoice, origin?: ThemeOrigin): void {
  const current = getAppearanceSnapshot();
  if (current.appearance.theme === next) return;
  const html = document.documentElement;
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  html.style.setProperty("--vt-x", `${Math.round(x)}px`);
  html.style.setProperty("--vt-y", `${Math.round(y)}px`);
  playSound("doira");
  runTransition("theme-switch", async () => {
    setAppearance({ theme: next });
    await nextTask();
  });
}

export function switchDesign(next: Design): void {
  const current = getAppearanceSnapshot();
  if (current.appearance.design === next) return;
  const html = document.documentElement;
  html.setAttribute("data-design-to", next);
  const anchor = captureAnchor();
  playSound("paper");
  runTransition("design-switch", async () => {
    setAppearance({ design: next });
    await nextTask();
    restoreAnchor(anchor);
  });
}
