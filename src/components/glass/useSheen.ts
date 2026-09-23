"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function percentOf(value: string, size: number, fallback: number): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? (n / 100) * size : fallback;
}

/**
 * Yaltiroq nuqta: kompyuterda kursor ortidan, sensorli qurilmada skroll boʻyicha yuradi.
 * Faqat --sheen-x/--sheen-y oʻzgaradi, qatlam oʻzi qayta yotqizilmaydi.
 */
export function useSheen(ref: RefObject<HTMLElement | null>, enabled: boolean): void {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = (): void => {
      frame = 0;
      element.style.setProperty("--sheen-x", `${Math.round(x)}px`);
      element.style.setProperty("--sheen-y", `${Math.round(y)}px`);
    };
    const schedule = (): void => {
      if (frame === 0) frame = requestAnimationFrame(paint);
    };
    const rest = (): void => {
      const rect = element.getBoundingClientRect();
      const styles = getComputedStyle(element);
      x = percentOf(styles.getPropertyValue("--light-x"), rect.width, rect.width * 0.3);
      y = percentOf(styles.getPropertyValue("--light-y"), rect.height, 0);
      schedule();
    };
    rest();

    if (window.matchMedia(FINE_POINTER).matches) {
      const move = (event: PointerEvent): void => {
        const rect = element.getBoundingClientRect();
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        schedule();
      };
      element.addEventListener("pointermove", move, { passive: true });
      element.addEventListener("pointerleave", rest);
      return () => {
        cancelAnimationFrame(frame);
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", rest);
      };
    }

    const onScroll = (): void => {
      const rect = element.getBoundingClientRect();
      const progress = (window.scrollY / Math.max(1, window.innerHeight)) % 1;
      x = rect.width * 0.3 + progress * rect.width * 0.4;
      y = progress * rect.height;
      schedule();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref, enabled]);
}
