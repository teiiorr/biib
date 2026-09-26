"use client";

import { useLayoutEffect } from "react";

import { applyAppearance, readStorage, resolveTheme } from "./dom";

/**
 * 404 xato qobigʻida chiziladi (html#__next_error__): React qoʻygan <head> dagi boot skript bajarilmaydi.
 * Boot izi (data-theme-choice) boʻlmasa, saqlangan koʻrinish shu yerda, birinchi chizishdan oldin qoʻyiladi:
 * mavzu, Harakat va Ovoz tashrifchi tanlaganidek boʻladi.
 */
export function AppearanceBootFallback(): null {
  useLayoutEffect(() => {
    if (document.documentElement.hasAttribute("data-theme-choice")) return;
    const appearance = readStorage();
    applyAppearance(appearance, resolveTheme(appearance.theme));
  }, []);
  return null;
}
