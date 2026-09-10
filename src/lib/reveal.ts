"use client";

/**
 * Bitta umumiy IntersectionObserver. Har bir element uçun alohida
 * observer yaratiş — bekorga yuk.
 */

let observer: IntersectionObserver | null = null;

function activate(element: Element): void {
  if (element.hasAttribute("data-reveal")) element.setAttribute("data-reveal", "in");
  if (element.hasAttribute("data-draw")) element.setAttribute("data-draw", "in");
  element.querySelectorAll("[data-draw]").forEach((child) => child.setAttribute("data-draw", "in"));
}

function getObserver(): IntersectionObserver | null {
  if (typeof window === "undefined") return null;
  if (!("IntersectionObserver" in window)) return null;

  observer ??= new IntersectionObserver(
    (entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        activate(entry.target);
        self.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
  );

  return observer;
}

export function observeReveal(element: Element | null): () => void {
  if (!element) return () => {};

  const io = getObserver();
  if (!io) {
    activate(element);
    return () => {};
  }

  io.observe(element);
  return () => io.unobserve(element);
}
