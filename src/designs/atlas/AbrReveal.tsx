"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import type { ArtProps } from "../registry";

const BANDS = 8;
const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Abr ochilishi: rasm ustidagi vertikal pardalar doira ritmida koʻtariladi, rasm oʻzi pogʻonali
 * (steps) tushib joyiga oʻtiradi — iplar bir-biriga toʻgʻri kelgandek. Faqat transform/opacity.
 */
export default function AbrReveal({ children, className }: ArtProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<"idle" | "play" | "done">("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const html = document.documentElement;
    /* Kamaytirilgan harakat: pardalar umuman koʻrsatilmaydi, holat DOM da belgilanadi. */
    if (window.matchMedia(REDUCED).matches || html.getAttribute("data-motion") === "off") {
      element.setAttribute("data-state", "done");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("play");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(element);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("abr-reveal", className)} data-state={state}>
      <div className="abr-reveal-content">{children}</div>
      <div className="abr-reveal-bands" aria-hidden="true">
        {Array.from({ length: BANDS }, (_, i) => (
          <span
            key={i}
            className="abr-reveal-band"
            style={{ "--band-index": i } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
