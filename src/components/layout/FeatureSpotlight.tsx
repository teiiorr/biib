"use client";

import { useEffect } from "react";

/**
 * Punkt fichasining yorugʻlik dogʻi: bitta umumiy pointermove tinglovchisi kursor ostidagi .feature ga
 * --mx/--my ni yozadi (har punktga alohida tinglovchi yoʻq). Faqat aniq koʻrsatkichda; kuchsiz
 * qurilmada dogʻ CSS da oʻchiq.
 */
export function FeatureSpotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;
    const paint = (): void => {
      frame = 0;
      target?.style.setProperty("--mx", `${Math.round(x)}px`);
      target?.style.setProperty("--my", `${Math.round(y)}px`);
    };
    const move = (event: PointerEvent): void => {
      const el =
        event.target instanceof Element ? event.target.closest<HTMLElement>(".feature") : null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      target = el;
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (frame === 0) frame = requestAnimationFrame(paint);
    };
    document.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", move);
    };
  }, []);
  return null;
}
