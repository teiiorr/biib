import { getAppearanceSnapshot, setAppearance } from "./store";
import type { ThemeChoice } from "./types";

export interface ThemeOrigin {
  readonly x: number;
  readonly y: number;
}

export type TransitionType = "theme-switch";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

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
  runTransition("theme-switch", async () => {
    setAppearance({ theme: next });
    await nextTask();
  });
}
