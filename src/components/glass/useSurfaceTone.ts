"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const THRESHOLDS = [0, 0.05, 0.25, 0.5, 0.75, 1];

/**
 * Sirt ostidagi boʻlim ohangini oʻqiydi: kuzatuv maydoni sirtning oʻz balandligi.
 * Eng katta kesishgan boʻlimning data-tone qiymati sirtga koʻchadi.
 */
export function useSurfaceTone(ref: RefObject<HTMLElement | null>, enabled = true): void {
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const areas = new Map<Element, number>();
    let observer: IntersectionObserver | null = null;
    let rebuildFrame = 0;

    const apply = (): void => {
      let best: Element | null = null;
      let bestArea = 0;
      for (const [section, area] of areas) {
        if (area > bestArea) {
          best = section;
          bestArea = area;
        }
      }
      const tone = best?.getAttribute("data-tone");
      if (tone === "light" || tone === "dark") element.setAttribute("data-tone", tone);
      else element.removeAttribute("data-tone");
    };

    const build = (): void => {
      observer?.disconnect();
      areas.clear();
      const rect = element.getBoundingClientRect();
      const top = Math.max(0, Math.round(rect.top));
      const bottom = Math.max(0, Math.round(window.innerHeight - rect.bottom));
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const area = entry.isIntersecting
              ? entry.intersectionRect.width * entry.intersectionRect.height
              : 0;
            areas.set(entry.target, area);
          }
          apply();
        },
        { rootMargin: `${-top}px 0px ${-bottom}px 0px`, threshold: THRESHOLDS },
      );
      for (const section of document.querySelectorAll("[data-tone]")) {
        if (section !== element && !element.contains(section)) observer.observe(section);
      }
    };

    const scheduleBuild = (): void => {
      if (rebuildFrame === 0) {
        rebuildFrame = requestAnimationFrame(() => {
          rebuildFrame = 0;
          build();
        });
      }
    };

    build();
    const resize = new ResizeObserver(scheduleBuild);
    resize.observe(element);
    /* Boʻlimlar marshrut almashganda keyin paydo boʻladi: roʻyxat oʻzgargandagina qayta yigʻiladi. */
    const sectionsSignature = (): string => {
      let next = "";
      for (const section of document.querySelectorAll("[data-tone]")) {
        next += `${section.tagName}:${section.getAttribute("data-tone")};`;
      }
      return next;
    };
    let signature = sectionsSignature();
    const mutations = new MutationObserver(() => {
      const next = sectionsSignature();
      if (next === signature) return;
      signature = next;
      scheduleBuild();
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rebuildFrame);
      observer?.disconnect();
      resize.disconnect();
      mutations.disconnect();
      element.removeAttribute("data-tone");
    };
  }, [ref, enabled]);
}
