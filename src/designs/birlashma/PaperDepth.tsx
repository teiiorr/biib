"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { ScrollTrigger, gsap, setupGsap } from "@/components/motion/gsap";
import { cn } from "@/lib/cn";

import { paperEdgePath } from "./lib/paper-edge";
import { hashString } from "./lib/seed";

const REDUCED = "(prefers-reduced-motion: reduce)";
const HOVER = "(hover: hover) and (pointer: fine)";
/* Chuqurlik koeffitsiyentlari (25.4.2): orqa qatlam sekin, oldingi tezroq. */
const DEPTH = [0.08, 0.16, 0.24] as const;

interface PaperDepthProps {
  readonly seed: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * Uch qatlamli qogʻoz-qirqma parallaks: yirtiq chetli boʻyoq varaqlari bola ishlari ortida.
 * Skroll bilan 0.08 / 0.16 / 0.24, sichqonchada 12 px gacha. Kamaytirilgan harakat va Harakat oʻchiq boʻlsa statik.
 */
export function PaperDepth({ seed, children, className }: PaperDepthProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const base = hashString(seed);
  const layers = DEPTH.map((depth, i) => ({
    depth,
    d: paperEdgePath(base + i * 97, "torn", 18),
  }));

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const html = document.documentElement;
    const still = window.matchMedia(REDUCED).matches || html.getAttribute("data-motion") === "off";
    if (still) return;
    setupGsap();
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
    const scene = root.closest<HTMLElement>(".home-hero") ?? root;
    const tweens = nodes.map((node) =>
      gsap.to(node, {
        y: () => -Number(node.dataset.depth) * scene.offsetHeight,
        ease: "none",
        scrollTrigger: { trigger: scene, start: "top top", end: "bottom top", scrub: 0.8 },
      }),
    );
    const setters = nodes.map((node) => ({
      x: gsap.quickTo(node, "x", { duration: 0.6, ease: "power2.out" }),
      depth: Number(node.dataset.depth),
    }));
    const onMove = (event: PointerEvent): void => {
      const rect = scene.getBoundingClientRect();
      /* Y oʻqi skroll tweeniga tegishli; sichqoncha faqat x ni suradi, ikki manba toʻqnashmaydi. */
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      for (const s of setters) s.x(px * 24 * (s.depth / DEPTH[2]));
    };
    const fine = window.matchMedia(HOVER).matches;
    if (fine) scene.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      if (fine) scene.removeEventListener("pointermove", onMove);
      for (const tween of tweens) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <div ref={ref} className={cn("paper-depth", className)}>
      <div className="paper-depth-layers" aria-hidden="true">
        {layers.map((layer, i) => (
          <svg
            key={layer.depth}
            className={`paper-depth-layer paper-depth-layer-${i + 1}`}
            data-depth={layer.depth}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            focusable="false"
          >
            <path d={layer.d} fill="currentColor" />
          </svg>
        ))}
      </div>
      <div className="paper-depth-content">{children}</div>
    </div>
  );
}
