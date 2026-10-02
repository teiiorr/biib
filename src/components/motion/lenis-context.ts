"use client";

import type Lenis from "lenis";

/** Faol Lenis kichik tashqi doʻkonda turadi, shunda provayder effekt ichida setState chaqirmaydi. */
let current: Lenis | null = null;
const listeners = new Set<() => void>();

export function setCurrentLenis(instance: Lenis | null): void {
  if (current === instance) return;
  current = instance;
  listeners.forEach((l) => l());
}
