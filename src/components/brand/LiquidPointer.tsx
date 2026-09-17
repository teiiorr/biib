"use client";

import { useEffect, useRef } from "react";

/**
 * Umumiy sıçkon kuzatgiçi. Har bir tugmaga alohida hodisa tinglagiç
 * qöşiş örniga, bitta window listener .btn-liquid ni topib --mx/--my
 * yozadi. Şunda LinkButton va ExternalButton kabi server komponentlar
 * client'ga aylanmaydi — CSS sinfi kifoya, React qayta render qilmaydi.
 */
export function LiquidPointer() {
  const frame = useRef(0);

  useEffect(() => {
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;

      // target har doim ham Element emas (masalan, document) — tekşirmasak
      // closest() yoq joyda yiqiladi.
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const el = origin.closest<HTMLElement>(".btn-liquid");
      if (!el) return;

      const box = el.getBoundingClientRect();
      target = el;
      x = event.clientX - box.left;
      y = event.clientY - box.top;

      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        target?.style.setProperty("--mx", `${x}px`);
        target?.style.setProperty("--my", `${y}px`);
        frame.current = 0;
      });
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return null;
}
