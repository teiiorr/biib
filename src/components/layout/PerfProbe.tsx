"use client";

import { useEffect } from "react";

import { PERF_STORAGE_KEY } from "@/lib/perf";

/* Oʻrtacha telefonda ≈ 8–12 ms, eski Android (Cortex-A53) da 40 ms dan ortiq. */
const SLOW_MS = 28;

function benchmark(): number {
  const started = performance.now();
  let sum = 0;
  for (let i = 0; i < 1_500_000; i += 1) sum += Math.sqrt(i) * 0.5;
  // Natija ishlatiladi: aks holda JIT siklni tashlab yuborishi mumkin.
  return sum > 0 ? performance.now() - started : 0;
}

/**
 * Qurilma belgilari (bosh skript) koʻrmagan kuchsiz telefonlar uchun: sahifa tinchiganda qisqa hisob
 * oʻlchanadi (ikki marta, eng yaxshisi olinadi) va sekin boʻlsa <html data-perf="lite"> qoʻyiladi,
 * natija 7 kunga saqlanadi. Keyingi sahnalar (skroll sahnalari, soʻzlarga boʻlish, sinish) yengil yoʻlda.
 */
export function PerfProbe() {
  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute("data-perf") === "lite") return;
    const run = (): void => {
      const best = Math.min(benchmark(), benchmark());
      if (best < SLOW_MS) return;
      html.setAttribute("data-perf", "lite");
      try {
        localStorage.setItem(PERF_STORAGE_KEY, JSON.stringify({ lite: true, at: Date.now() }));
      } catch {
        // Saqlash taqiqlangan brauzerda faqat shu sahifa yengil.
      }
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    const handle = window.setTimeout(() => idle(run), 1500);
    return () => window.clearTimeout(handle);
  }, []);
  return null;
}
