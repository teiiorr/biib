"use client";

import { useLayoutEffect, useRef } from "react";

import { useStickyFeature } from "@/components/motion/useStickyFeature";
import type { LateProps } from "@/components/motion/with-engine";

/** Koʻrinmas barg: sahnani server chizgan boʻlimga ulaydi, ortiqcha oʻram qoʻshmaydi. */
export function UpopSceneLeaf({ late }: LateProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLElement | null>(null);

  // useLayoutEffect: sahna hooki boʻlimni shu kadrning oʻzida oʻqiydi.
  useLayoutEffect(() => {
    root.current = anchor.current?.closest<HTMLElement>(".upop-feature") ?? null;
  }, []);

  useStickyFeature(root, late);
  return <span ref={anchor} hidden data-upop-motion="" />;
}
