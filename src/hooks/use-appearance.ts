"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  CONTRAST_KEY,
  DEFAULT_INTENSITY,
  INTENSITY_KEY,
  MOTION_KEY,
  TEXT_KEY,
  clampIntensity,
  type ContrastSetting,
  type MotionSetting,
  type TextSetting,
} from "@/lib/appearance";

/*
 * Haqiqiy manba — <html> ning özi: --glass-intensity va data-motion /
 * data-text / data-contrast atributlari. Şunda sahifadagi barça
 * boşqaruvlar bir-biriga özi ergaşadi va holat ikki joyda saqlanmaydi.
 * Atributlarni appearanceInitScript qöyadi; tumbler localStorage ga
 * yozib "biib:appearance" ni yuboradi — skript şuni eşitib turadi.
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
      attributeFilter: ["style", "data-motion", "data-text", "data-contrast"],
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

function store(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Şaxsiy rejimda xotira yopiq bölişi mumkin — atribut baribir qöyiladi.
  }
  window.dispatchEvent(new Event("biib:appearance"));
  emit();
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

/** Harakat: joriy amaldagi holat (atributdan) + tumbler. */
export function useMotionSetting(): [boolean, (reduce: boolean) => void] {
  const reduced = useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute("data-motion") === "reduce",
    () => false,
  );

  const set = useCallback((reduce: boolean) => {
    const system = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Tanlov tizim bilan bir xil bölsa saqlanmaydi — "auto" qoladi.
    const next: MotionSetting | null = reduce
      ? system
        ? null
        : "reduce"
      : system
        ? "full"
        : null;
    store(MOTION_KEY, next);
  }, []);

  return [reduced, set];
}

/** Matn ölçami: md / lg / xl. */
export function useTextSetting(): [TextSetting, (next: TextSetting) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const raw = document.documentElement.getAttribute("data-text");
      return raw === "lg" || raw === "xl" ? raw : "md";
    },
    () => "md" as const,
  );

  const set = useCallback((next: TextSetting) => {
    store(TEXT_KEY, next === "md" ? null : next);
  }, []);

  return [value, set];
}

/** Kontrast: amaldagi holat + tumbler (tizim "more" desa, öçirib bölmaydi). */
export function useContrastSetting(): [boolean, boolean, (more: boolean) => void] {
  const more = useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute("data-contrast") === "more",
    () => false,
  );

  const system = useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-contrast: more)").matches,
    () => false,
  );

  const set = useCallback((next: boolean) => {
    const setting: ContrastSetting = next ? "more" : "auto";
    store(CONTRAST_KEY, setting === "auto" ? null : setting);
  }, []);

  return [more, system, set];
}
