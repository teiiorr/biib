"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  // Harakat tugmasi <html data-motion> ni oʻzgartiradi: naqsh shu zahoti statik boʻlishi kerak.
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  return () => {
    media.removeEventListener("change", onChange);
    observer.disconnect();
  };
}

function snapshot(): boolean {
  return !window.matchMedia(QUERY).matches && document.documentElement.dataset.motion !== "off";
}

/** Serverda va gidratsiya paytida false: naqsh toʻliq chizilgan holda keladi, keyin jonlanadi. */
export function useMotionAllowed(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
