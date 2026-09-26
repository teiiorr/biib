"use client";

import { useEffect } from "react";

import { playTap, preloadTap, primeAudio } from "./synth";

const INTERACTIVE =
  "a[href],button,input,select,textarea,label,summary,[role=button],[role=link],[role=switch],[role=tab],[role=menuitem],[role=menuitemradio],[role=radio],[role=option],[role=checkbox],[role=slider]";
/* Ovoz shu yerda yoqilishi mumkin: kontekst hozir, bosish ichida ochiladi. */
const SOUND_CONTROLS = "[role=switch],.appearance-panel";
const TAP_SLOP_PX = 12;
const TOUCH_CLICK_WINDOW_MS = 800;

function soundOn(): boolean {
  return document.documentElement.getAttribute("data-sound") !== "off";
}

function elementOf(target: EventTarget | null): Element | null {
  return target instanceof Element ? target : null;
}

/** Hamma bosishlar uchun yagona tinglovchi: sahifaning istalgan joyiga bosilsa doira zarbasi chalinadi. */
export function TapSound(): null {
  useEffect(() => {
    const starts = new Map<number, { x: number; y: number }>();
    let lastTouchAt = -Infinity;
    /* 7.5 KB zarba fayli sahifa tinchiganda: birinchi bosishda tarmoq kutilmaydi. */
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    if (soundOn()) idle(() => preloadTap());

    const respond = (target: Element | null): void => {
      if (soundOn() || target?.closest(SOUND_CONTROLS)) primeAudio();
      const bright = target?.closest(INTERACTIVE) != null;
      /* Holat Reactʼdan keyin oʻqiladi: Ovoz yoqilganda tasdiq zarbasi chalinadi, oʻchirilganda jim. */
      window.setTimeout(() => {
        if (soundOn()) playTap(bright);
      }, 0);
    };

    const onPointerDown = (event: PointerEvent): void => {
      if (event.pointerType === "mouse") return;
      starts.set(event.pointerId, { x: event.clientX, y: event.clientY });
    };
    const onPointerCancel = (event: PointerEvent): void => {
      starts.delete(event.pointerId);
    };
    /* Sensorli ekranda click emas, pointerup: iOS oddiy elementlardagi click ni documentʼgacha yetkazmaydi,
       aylantirish esa pointercancel bilan tugaydi va ovoz chiqarmaydi. */
    const onPointerUp = (event: PointerEvent): void => {
      const start = starts.get(event.pointerId);
      starts.delete(event.pointerId);
      if (!event.isTrusted || !start) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP_PX) return;
      const target = elementOf(event.target);
      /* Almashtirgich holati click da oʻzgaradi, shu sabab uni click oʻzi ovozlaydi. */
      if (target?.closest("[role=switch]")) return;
      lastTouchAt = performance.now();
      respond(target);
    };
    const onClick = (event: MouseEvent): void => {
      if (!event.isTrusted) return;
      if (performance.now() - lastTouchAt < TOUCH_CLICK_WINDOW_MS) {
        /* Zarba pointerup da chalingan; click faqat kontekst ochilmay qolgan boʻlsa uni ochadi. */
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
