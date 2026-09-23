import {
  applyAppearance,
  readAppearanceFromDocument,
  resolveTheme,
  writeStorage,
} from "./dom";
import {
  DEFAULT_APPEARANCE,
  normalizeAppearance,
  type Appearance,
  type ResolvedTheme,
} from "./types";

export interface AppearanceSnapshot {
  readonly appearance: Appearance;
  readonly resolvedTheme: ResolvedTheme;
}

const SERVER_SNAPSHOT: AppearanceSnapshot = {
  appearance: DEFAULT_APPEARANCE,
  resolvedTheme: "light",
};

let snapshot: AppearanceSnapshot | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function getServerAppearanceSnapshot(): AppearanceSnapshot {
  return SERVER_SNAPSHOT;
}

export function getAppearanceSnapshot(): AppearanceSnapshot {
  if (typeof document === "undefined") return SERVER_SNAPSHOT;
  if (!snapshot) {
    const appearance = readAppearanceFromDocument();
    snapshot = { appearance, resolvedTheme: resolveTheme(appearance.theme) };
  }
  return snapshot;
}

export function subscribeAppearance(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setAppearance(patch: Partial<Appearance>): AppearanceSnapshot {
  const previous = getAppearanceSnapshot();
  const appearance = normalizeAppearance({ ...previous.appearance, ...patch });
  const resolvedTheme = resolveTheme(appearance.theme);
  snapshot = { appearance, resolvedTheme };
  applyAppearance(appearance, resolvedTheme);
  writeStorage(appearance);
  emit();
  return snapshot;
}

export function resetAppearance(): AppearanceSnapshot {
  return setAppearance(DEFAULT_APPEARANCE);
}

/** Tizim mavzusi oʻzgarganda faqat «system» tanlovi qayta hisoblanadi. */
export function refreshSystemTheme(): void {
  const current = getAppearanceSnapshot();
  if (current.appearance.theme !== "system") return;
  const resolvedTheme = resolveTheme("system");
  if (resolvedTheme === current.resolvedTheme) return;
  snapshot = { appearance: current.appearance, resolvedTheme };
  applyAppearance(current.appearance, resolvedTheme);
  emit();
}

/** Boshqa oynada oʻzgargan sozlama shu oynaga ham tushadi. */
export function replaceAppearance(next: Appearance): void {
  const resolvedTheme = resolveTheme(next.theme);
  snapshot = { appearance: next, resolvedTheme };
  applyAppearance(next, resolvedTheme);
  emit();
}
