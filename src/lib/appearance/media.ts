"use client";

import { useSyncExternalStore } from "react";

export const REDUCED_TRANSPARENCY_QUERY = "(prefers-reduced-transparency: reduce)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const DESKTOP_QUERY = "(min-width: 1024px)";

type Subscribe = (listener: () => void) => () => void;

/* Har renderda yangi obuna funksiyasi yaratilsa, useSyncExternalStore qayta obuna boʻlaverardi. */
const subscribers = new Map<string, Subscribe>();

function subscribe(query: string): Subscribe {
  let fn = subscribers.get(query);
  if (!fn) {
    fn = (listener) => {
      if (typeof window === "undefined") return () => {};
      const media = window.matchMedia(query);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    };
    subscribers.set(query, fn);
  }
  return fn;
}

/** Serverda har doim false: birinchi chizilish server bilan bir xil boʻladi. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function useReducedTransparency(): boolean {
  return useMediaQuery(REDUCED_TRANSPARENCY_QUERY);
}

export function useReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}

export function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_QUERY);
}
