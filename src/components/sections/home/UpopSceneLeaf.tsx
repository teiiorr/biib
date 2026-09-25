"use client";

import { useLayoutEffect, useRef } from "react";

import { useStickyFeature } from "@/components/motion/useStickyFeature";
import type { LateProps } from "@/components/motion/with-engine";

/** UPOP boʻlimi ichidagi koʻrinmas barg: server DOM ga upop-scene ni ulaydi (oʻram qoʻshilmaydi). */
export function UpopSceneLeaf({ late }: LateProps) {
  const anchor = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLElement | null>(null);

  // Hookdan oldin: sahna shu kadrda boʻlimni oʻqiydi.
  useLayoutEffect(() => {
    root.current = anchor.current?.closest<HTMLElement>(".upop-feature") ?? null;
  }, []);

  useStickyFeature(root, late);
  return <span ref={anchor} hidden data-upop-motion="" />;
}
