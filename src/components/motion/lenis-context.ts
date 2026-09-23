"use client";

import type Lenis from "lenis";

/** Yagona faol Lenis: kichik tashqi doʻkon, shunda provayder effektda setState chaqirmaydi. */
let current: Lenis | null = null;
const listeners = new Set<() => void>();

export function setCurrentLenis(instance: Lenis | null): void {
  if (current === instance) return;
  current = instance;
  listeners.forEach((l) => l());
}
