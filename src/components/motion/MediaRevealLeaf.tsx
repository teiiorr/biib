"use client";

import { useLayoutEffect, useRef } from "react";

import { doiraDelay } from "@/lib/motion/doira";

import type { MediaRevealProps } from "./MediaReveal";
import { useMediaParallax, useParallaxDepth } from "./useMediaParallax";
import { useMediaReveal } from "./useMediaReveal";
import type { LateProps } from "./with-engine";

/**
 * Server media ramkasi (MediaFrame) ichidagi koʻrinmas barg: ota ramkaga media-reveal va
 * media-parallax ulaydi. Oʻram yoʻq — ramka DOM i, nisbati va umumiy element nomi oʻzgarmaydi.
 */
export function MediaRevealLeaf({
  mode = "abr",
  index = 0,
  parallax = false,
  late,
}: MediaRevealProps & LateProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLElement | null>(null);
  const depth = useParallaxDepth();
  const activeDepth = parallax ? depth : 0;

  // Hooklardan oldin: ular shu kadrda ota ramkani oʻqiydi.
  useLayoutEffect(() => {
    box.current = anchor.current?.closest<HTMLElement>(".media-frame") ?? null;
  }, []);

  useMediaReveal(box, {
    enabled: mode !== "none",
    mode: mode === "abr" ? "abr" : "smooth",
    delay: doiraDelay(index),
    restScale: 1 + activeDepth,
  });
  useMediaParallax(box, activeDepth, late);

  return <span ref={anchor} hidden data-media-motion="" />;
}
