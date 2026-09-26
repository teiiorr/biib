import { applyAppearance, readAppearanceFromDocument, writeStorage } from "./dom";
import { DEFAULT_APPEARANCE, normalizeAppearance, type Appearance } from "./types";

let snapshot: Appearance | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function getServerAppearanceSnapshot(): Appearance {
  return DEFAULT_APPEARANCE;
}

export function getAppearanceSnapshot(): Appearance {
  if (typeof document === "undefined") return DEFAULT_APPEARANCE;
  snapshot ??= readAppearanceFromDocument();
  return snapshot;
}

export function subscribeAppearance(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setAppearance(patch: Partial<Appearance>): Appearance {
  const appearance = normalizeAppearance({ ...getAppearanceSnapshot(), ...patch });
  snapshot = appearance;
  applyAppearance(appearance);
  writeStorage(appearance);
  emit();
  return appearance;
}

export function resetAppearance(): Appearance {
  return setAppearance(DEFAULT_APPEARANCE);
}

/** Boshqa oynada oʻzgargan sozlama shu oynaga ham tushadi. */
export function replaceAppearance(next: Appearance): void {
  snapshot = next;
  applyAppearance(next);
  emit();
}
