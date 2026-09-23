"use client";

import type Lenis from "lenis";
import { useSyncExternalStore } from "react";
import { motionAllowedNow } from "@/lib/motion/prefs";

/** Yagona faol Lenis: kichik tashqi doʻkon, shunda provayder effektda setState chaqirmaydi. */
let current: Lenis | null = null;
const listeners = new Set<() => void>();

export function setCurrentLenis(instance: Lenis | null): void {
  if (current === instance) return;
  current = instance;
  listeners.forEach((l) => l());
}

export function getCurrentLenis(): Lenis | null {
  return current;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getServerSnapshot = (): Lenis | null => null;

/** Faol Lenis yoki null (touch, kamaytirilgan harakat, Harakat=off, SSR). */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(subscribe, getCurrentLenis, getServerSnapshot);
}

export type ScrollTarget = number | string | HTMLElement;

export interface ScrollToOptions {
  readonly offset?: number;
  readonly immediate?: boolean;
}

function resolveElement(target: ScrollTarget): HTMLElement | null {
  if (target instanceof HTMLElement) return target;
  if (typeof target === "string") return document.querySelector<HTMLElement>(target);
  return null;
}

/** Lenis boʻlsa u orqali, aks holda tabiiy scrollIntoView/scrollTo (harakat ruxsatiga qarab). */
export function scrollTo(target: ScrollTarget, options: ScrollToOptions = {}): void {
  if (typeof window === "undefined") return;
  const offset = options.offset ?? 0;
  const immediate = options.immediate === true;

  if (current) {
    current.scrollTo(target, { offset, immediate });
    return;
  }

  const behavior: ScrollBehavior = immediate || !motionAllowedNow() ? "auto" : "smooth";
  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior });
    return;
  }
  const el = resolveElement(target);
  if (!el) return;
  if (offset === 0) {
    el.scrollIntoView({ behavior, block: "start" });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
