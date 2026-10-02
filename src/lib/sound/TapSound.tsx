"use client";

import { useEffect } from "react";

import { playTap, preloadTap, primeAudio } from "./synth";

/* Ovoz shu boshqaruvlarda yoqiladi: kontekst oʻsha bosishning oʻzida ochilishi kerak. */
const SOUND_CONTROLS = "[role=switch],.appearance-panel";
/* Zarba faqat boshqaruv elementi bosilganda chalinadi, sahifaning boʻsh joyiga tegilganda emas. */
const INTERACTIVE =
  "a[href],button,summary,input[type=submit],input[type=button],[role=button],[role=link],[role=switch],[role=tab],[role=radio],[role=menuitem],[role=menuitemradio],[role=option],[role=slider]";
const TAP_SLOP_PX = 12;
const TOUCH_CLICK_WINDOW_MS = 800;

function soundOn(): boolean {
  return document.documentElement.getAttribute("data-sound") !== "off";
}

function elementOf(target: EventTarget | null): Element | null {
  return target instanceof Element ? target : null;
}

/** Barcha bosishlar hujjatdagi bitta tinglovchi orqali ovozlanadi. */
export function TapSound(): null {
  useEffect(() => {
    const starts = new Map<number, { x: number; y: number }>();
    let lastTouchAt = -Infinity;
    /* Zarba fayli brauzer boʻsh turganda yuklanadi: birinchi bosishda tarmoq kutilmaydi. */
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    if (soundOn()) idle(() => preloadTap());

    const respond = (target: Element | null): void => {
      if (!target?.closest(INTERACTIVE)) return;
      if (soundOn() || target.closest(SOUND_CONTROLS)) primeAudio();
      /* Holat React yangilangandan keyin oʻqiladi: Ovoz yoqilganda tasdiq zarbasi chalinadi, oʻchirilganda jim. */
      window.setTimeout(() => {
        if (soundOn()) playTap();
      }, 0);
    };

    const onPointerDown = (event: PointerEvent): void => {
      if (event.pointerType === "mouse") return;
      starts.set(event.pointerId, { x: event.clientX, y: event.clientY });
    };
    const onPointerCancel = (event: PointerEvent): void => {
      starts.delete(event.pointerId);
    };
    /* Sensorli ekranda pointerup ishlatiladi: iOS oddiy elementlardagi click hodisasini document darajasigacha
       yetkazmaydi, aylantirish esa pointercancel bilan tugaydi va ovoz chiqarmaydi. */
    const onPointerUp = (event: PointerEvent): void => {
      const start = starts.get(event.pointerId);
      starts.delete(event.pointerId);
      if (!event.isTrusted || !start) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP_PX) return;
      const target = elementOf(event.target);
      /* Almashtirgich holati click paytida oʻzgaradi, shu sabab uni click ovozlaydi. */
      if (target?.closest("[role=switch]")) return;
      lastTouchAt = performance.now();
      respond(target);
    };
    const onClick = (event: MouseEvent): void => {
      if (!event.isTrusted) return;
      if (performance.now() - lastTouchAt < TOUCH_CLICK_WINDOW_MS) {
        /* Zarba pointerup paytida chalingan, bu yerda faqat ochilmay qolgan kontekst ochiladi. */
        if (soundOn()) primeAudio();
        return;
      }
      respond(elementOf(event.target));
    };

    const options = { capture: true, passive: true } as const;
    document.addEventListener("pointerdown", onPointerDown, options);
    document.addEventListener("pointercancel", onPointerCancel, options);
    document.addEventListener("pointerup", onPointerUp, options);
    document.addEventListener("click", onClick, options);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, options);
      document.removeEventListener("pointercancel", onPointerCancel, options);
      document.removeEventListener("pointerup", onPointerUp, options);
      document.removeEventListener("click", onClick, options);
    };
  }, []);

  return null;
}
