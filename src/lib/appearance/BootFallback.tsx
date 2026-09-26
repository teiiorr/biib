"use client";

import { useLayoutEffect } from "react";

import { applyAppearance, readStorage } from "./dom";

/**
 * 404 xato qobigʻida chiziladi (html#__next_error__): React qoʻygan <head> dagi boot skript bajarilmaydi.
 * Boot izi (data-boot) boʻlmasa, saqlangan koʻrinish shu yerda, birinchi chizishdan oldin qoʻyiladi:
 * oyna, Harakat va Ovoz tashrifchi tanlaganidek boʻladi.
 */
export function AppearanceBootFallback(): null {
  useLayoutEffect(() => {
    if (document.documentElement.hasAttribute("data-boot")) return;
    applyAppearance(readStorage());
  }, []);
  return null;
}
