"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { DURATION } from "@/lib/motion/constants";
import { motionAllowed } from "@/lib/motion/prefs";
import { doiraStaggerFn, EASE, gsap, SplitText } from "./gsap";
import { useMotionPrefs } from "./motion-context";

/** h1 ataylab yoʻq: LCP sarlavha hech qachon boʻlinmaydi. */
type SplitTag = "h2" | "h3" | "h4" | "p" | "blockquote" | "div" | "span";

export interface SplitLinesProps {
  readonly as?: SplitTag;
  readonly children: ReactNode;
  readonly className?: string;
  readonly id?: string;
  readonly start?: string;
}

/**
 * split-lines: qatorlar niqob ostidan y 100%→0, 1000 ms, doira ritmi.
 * Matn serverda oddiy holda keladi (SEO), shriftlar kelgach boʻlinadi, unmount da qaytariladi.
 */
export function SplitLines({
  as = "h2",
  children,
  className,
  id,
  start = "top 85%",
}: SplitLinesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);

  useEffect(() => {
    const el = ref.current;
    if (!el || !allowed) return;
    let cancelled = false;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {}, el);

    void document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx.add(() => {
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          aria: "auto",
          linesClass: "split-line",
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              duration: DURATION.lines,
              ease: EASE.out,
              stagger: doiraStaggerFn(),
              scrollTrigger: { trigger: el, start, once: true },
            }),
        });
      });
    });

    return () => {
      cancelled = true;
      ctx.revert();
      split?.revert();
    };
  }, [allowed, start]);

  // Teg birligi uchun bitta intrinsik tur: barcha ruxsat etilgan teglar HTMLElement beradi.
  const Tag = as as "div";
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
