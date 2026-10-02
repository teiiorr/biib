"use client";

import { useLayoutEffect } from "react";

import { applyAppearance, readStorage } from "./dom";

/**
 * 404 xato qobigʻida (html#__next_error__) React qoʻygan boot skript bajarilmaydi. data-boot izi
 * boʻlmasa, saqlangan koʻrinish shu yerda birinchi chizishdan oldin qoʻyiladi.
 */
export function AppearanceBootFallback(): null {
  useLayoutEffect(() => {
    if (document.documentElement.hasAttribute("data-boot")) return;
    applyAppearance(readStorage());
  }, []);
  return null;
}
