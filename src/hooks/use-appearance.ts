"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_INTENSITY,
  INTENSITY_KEY,
  THEME_KEY,
  clampIntensity,
  type ResolvedTheme,
  type ThemeChoice,
} from "@/lib/appearance";

/*
 * Haqiqiy manba — <html> ning özi: data-theme atributi va --glass-intensity
 * xususiyati. Şunda sahifadagi barça boşqaruvlar (sarlavhadagi va
 * sozlamalardagi) bir-biriga özi ergaşadi, holat ikki joyda saqlanmaydi.
 */

const listeners = new Set<() => void>();
let observer: MutationObserver | null = null;

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);

  if (!observer) {
    observer = new MutationObserver(emit);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "style"],
    });
    window.addEventListener("storage", emit);
  }

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && observer) {
      observer.disconnect();
      observer = null;
      window.removeEventListener("storage", emit);
    }
  };
}

function readStored<T extends string>(key: string): T | null {
  try {
    return localStorage.getItem(key) as T | null;
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Şaxsiy rejimda xotira yopiq bölişi mumkin — holat baribir qöyildi.
  }
}

/** Mavzu almaşganda ranglar sakramasin. */
function withTransition(apply: () => void) {
  const root = document.documentElement;
  root.classList.add("tuning");
  apply();
  window.setTimeout(() => root.classList.remove("tuning"), 280);
}

export function useResolvedTheme(): ResolvedTheme {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"),
    () => "light" as ResolvedTheme,
  );
}

export function useThemeChoice(): [ThemeChoice, (next: ThemeChoice) => void] {
  const choice = useSyncExternalStore(
    subscribe,
    () => readStored<ThemeChoice>(THEME_KEY) ?? "system",
    () => "system" as ThemeChoice,
  );

  const set = useCallback((next: ThemeChoice) => {
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    withTransition(() => {
      document.documentElement.setAttribute("data-theme", next === "system" ? system : next);
    });
    writeStored(THEME_KEY, next === "system" ? null : next);
    emit();
  }, []);

  return [choice, set];
}

export function useGlassIntensity(): [number, (next: number) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const raw = document.documentElement.style.getPropertyValue("--glass-intensity");
      const parsed = Number.parseFloat(raw);
      return Number.isNaN(parsed) ? DEFAULT_INTENSITY : parsed;
    },
    () => DEFAULT_INTENSITY,
  );

  const set = useCallback((next: number) => {
    const clamped = clampIntensity(next);
    withTransition(() => {
      document.documentElement.style.setProperty("--glass-intensity", String(clamped));
    });
    writeStored(INTENSITY_KEY, String(clamped));
    emit();
  }, []);

  return [value, set];
}

/** Tizimda şaffoflik öçirilgan bölsa, suruvçi tanlovi kuçga kirmaydi. */
export function useReducedTransparency(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-transparency: reduce)").matches,
    () => false,
  );
}
