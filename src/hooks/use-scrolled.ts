"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Sentinel ni kuzatadi, scroll listener emas. Örtaça Android da
 * har kadrda backdrop-filter ni qayta hisoblaş fps ni ~40 ga tuşiradi,
 * IntersectionObserver esa faqat çegara kesilganda uyğonadi.
 */
export function useScrolled(sentinel: RefObject<HTMLElement | null>): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [sentinel]);

  return scrolled;
}
