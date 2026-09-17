"use client";

/**
 * Bitta umumiy IntersectionObserver. Har element uçun alohida observer
 * yaratiş bekorga yuk; skroll listener esa har kadrda uyğonadi.
 */

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return null;

  observer ??= new IntersectionObserver(
    (entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-reveal", "in");
        self.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
  );

  return observer;
}

export function observeReveal(element: Element | null): () => void {
  if (!element) return () => {};

  const io = getObserver();
  if (!io) {
    element.setAttribute("data-reveal", "in");
    return () => {};
  }

  io.observe(element);
  return () => io.unobserve(element);
}
