"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import type { RefObject } from "react";

import { useAppearance } from "@/lib/appearance/context";

import { refractionMap } from "./refraction-cache";

export interface Refraction {
  readonly id: string;
  readonly href: string;
  readonly scale: number;
}

interface NavigatorBrands {
  readonly userAgentData?: { readonly brands: ReadonlyArray<{ readonly brand: string }> };
}

let supportCache: boolean | null = null;

/**
 * Orqa fon piksellarini JS oʻqiy olmaydi, shu sabab dvigatel boʻyicha aniqlanadi.
 * Safari backdrop-filter ichida SVG filtrni qoʻllamaydi: unga sinishsiz variant.
 */
export function detectRefractionSupport(): boolean {
  if (supportCache !== null) return supportCache;
  if (typeof window === "undefined" || typeof CSS === "undefined") return false;
  const brands = (navigator as NavigatorBrands).userAgentData?.brands ?? [];
  const chromium = brands.some((entry) => /chromium/i.test(entry.brand));
  const declared = CSS.supports("backdrop-filter", "url(#lg-probe) blur(1px)");
  let applied = false;
  if (chromium && declared) {
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.position = "absolute";
    probe.style.width = "1px";
    probe.style.height = "1px";
    probe.style.opacity = "0";
    probe.style.pointerEvents = "none";
    probe.style.backdropFilter = "url(#lg-probe) blur(1px)";
    document.body.append(probe);
    applied = getComputedStyle(probe).backdropFilter.includes("url(");
    probe.remove();
  }
  supportCache = chromium && declared && applied;
  return supportCache;
}

function subscribeNever(): () => void {
  return () => undefined;
}

/* Aniqlash bir marta boʻladi va keshlanadi; serverda doim false. */
export function useRefractionSupport(): boolean {
  return useSyncExternalStore(subscribeNever, detectRefractionSupport, () => false);
}

function quantize(value: number): number {
  return Math.max(8, Math.round(value / 8) * 8);
}

export function useRefraction(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): Refraction | null {
  const reactId = useId();
  const supported = useRefractionSupport();
  const { appearance, reducedTransparency } = useAppearance();
  const [href, setHref] = useState<string | null>(null);
  const active = supported && enabled && !reducedTransparency;

  useEffect(() => {
    const element = ref.current;
    if (!active || !element) {
      setHref(null);
      return;
    }
    let lastKey = "";
    const update = (): void => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const width = quantize(rect.width);
      const height = quantize(rect.height);
      const radius = Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
      const key = `${width}:${height}:${Math.round(radius)}`;
      if (key === lastKey) return;
      lastKey = key;
      void refractionMap(width, height, Math.round(radius)).then((href) => {
        // Oʻlcham yana oʻzgargan boʻlsa eski xarita qoʻyilmaydi.
        if (!cancelled && lastKey === key) setHref(href);
      });
    };
    let cancelled = false;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [ref, active]);

  if (!href) return null;
  return {
    id: `lg-refract-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    href,
    scale: 8 + 56 * (appearance.density / 100),
  };
}
