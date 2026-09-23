"use client";

import { useGSAP } from "@gsap/react";
import { useRef, type ReactNode } from "react";
import { DURATION } from "@/lib/motion/constants";
import { motionAllowed } from "@/lib/motion/prefs";
import { willChangeDuring } from "@/lib/motion/will-change";
import { doiraStaggerFn, EASE, gsap } from "./gsap";
import { useMotionPrefs } from "./motion-context";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "ul"
  | "ol"
  | "li"
  | "p"
  | "span"
  | "figure";

export interface RevealProps {
  readonly as?: RevealTag;
  readonly children: ReactNode;
  readonly className?: string;
  readonly id?: string;
  /** true: bevosita bolalar doira ritmida kiradi; false: butun blok bitta boʻlib. */
  readonly stagger?: boolean;
  /** ScrollTrigger start, sukut "top 85%". */
  readonly start?: string;
  /** Qoʻshimcha kechikish, s. */
  readonly delay?: number;
}

/** reveal-rise: opacity 0→1, y 24→0, 900 ms. Matn DOM da; harakat taqiqlanganda darhol koʻrinadi. */
export function Reveal({
  as = "div",
  children,
  className,
  id,
  stagger = false,
  start = "top 85%",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !allowed) return;
      const targets: Element[] = stagger ? Array.from(root.children) : [root];
      if (targets.length === 0) return;
      const tween = gsap.from(targets, {
        autoAlpha: 0,
        y: 24,
        duration: DURATION.reveal,
        ease: EASE.out,
        delay,
        stagger: stagger ? doiraStaggerFn() : 0,
        clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: root, start, once: true },
      });
      willChangeDuring(tween, targets);
    },
    { scope: ref, dependencies: [allowed, stagger, start, delay], revertOnUpdate: true },
  );

  // Teg birligi uchun bitta intrinsik tur: barcha ruxsat etilgan teglar HTMLElement beradi.
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
