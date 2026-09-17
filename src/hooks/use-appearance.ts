"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DEFAULT_INTENSITY, INTENSITY_KEY, clampIntensity } from "@/lib/appearance";

/*
 * Haqiqiy manba — <html> ning özidagi --glass-intensity. Şunda sahifadagi
 * barça boşqaruvlar bir-biriga özi ergaşadi va holat ikki joyda saqlanmaydi.
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
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
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
    const root = document.documentElement;

    // Ranglar sakramasin: qisqa muddatga transition yoqiladi.
    root.classList.add("tuning");
    root.style.setProperty("--glass-intensity", String(clamped));
    window.setTimeout(() => root.classList.remove("tuning"), 280);

    try {
      localStorage.setItem(INTENSITY_KEY, String(clamped));
    } catch {
      // Şaxsiy rejimda xotira yopiq bölişi mumkin — qiymat baribir qöyildi.
    }
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
