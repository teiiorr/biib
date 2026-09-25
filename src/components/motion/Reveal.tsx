"use client";

import { useRef, type ReactNode } from "react";
import { DURATION, EASE } from "@/lib/motion/constants";
import { doiraStaggerFn, doiraUnit } from "@/lib/motion/doira";
import { motionAllowed } from "@/lib/motion/prefs";
import { belowViewport } from "@/lib/motion/viewport";
import { watchPending } from "@/lib/motion/watchdog";
import { willChangeDuring } from "@/lib/motion/will-change";
import { useEngineEffect } from "./engine";
import { useMotionPrefs } from "./motion-context";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "ul"
  | "ol"
  | "dl"
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
  /** Koʻtarilish masofasi, px: 16 mayda matn, 24 sukut, 40 media bloklari; tor ekranda ×0.66. */
  readonly distance?: 16 | 24 | 40;
  /** ScrollTrigger start, sukut "top 85%". */
  readonly start?: string;
  /** Qoʻshimcha kechikish, s. */
  readonly delay?: number;
  /** Audit va test belgilari (data-*), oʻramga oʻtkaziladi. */
  readonly attrs?: Readonly<Record<`data-${string}`, string>>;
  readonly label?: string;
  readonly labelledBy?: string;
}

/**
 * reveal-rise v2: opacity 0→1, y 24→0, 900 ms, doira ritmi (guruh 1.2 s ichida yoʻlga chiqadi).
 * Bitta element bir marta kiradi: dvigatel kelganda, sahifa oʻtishida yoki sozlama oʻzgarganda
 * ekranda turgan blok yashirilmaydi. Yashirilgan nishonlar data-reveal="pending" oladi va
 * qoʻriqchi (watchdog) trigger oʻtkazib yuborilsa ham ularni ochadi. Matn doim DOM da.
 */
export function Reveal({
  as = "div",
  children,
  className,
  id,
  stagger = false,
  distance = 24,
  start = "top 85%",
  delay = 0,
  attrs,
  label,
  labelledBy,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);
  const compact = prefs.breakpoint === "compact";

  useEngineEffect(
    ref,
    ({ gsap }) => {
      const root = ref.current;
      if (!root || !allowed || done.current) return;
      // Guruhda har bola alohida: ekranga sigʻganlari joyida qoladi, pastdagilar kiradi.
      const targets: Element[] = (stagger ? Array.from(root.children) : [root]).filter((el) =>
        belowViewport(el, 1),
      );
      const trigger = targets[0];
      if (!trigger) {
        done.current = true;
        return;
      }
      let tween: gsap.core.Tween | null = null;
      const watch = watchPending(trigger, targets, () => {
        tween?.scrollTrigger?.kill(false, true);
        tween?.play();
      });
      tween = gsap.from(targets, {
        autoAlpha: 0,
        y: Math.round(distance * (compact ? 0.66 : 1)),
        duration: DURATION.reveal,
        ease: EASE.out,
        delay,
        stagger: stagger ? doiraStaggerFn(doiraUnit(targets.length)) : 0,
        clearProps: "transform,opacity,visibility",
        onComplete: () => {
          done.current = true;
        },
        scrollTrigger: { trigger, start, once: true, onEnter: watch.started },
      });
      willChangeDuring(tween, targets);
      return watch.dispose;
    },
    [allowed, stagger, start, delay, distance, compact],
  );

  // Teg birligi uchun bitta intrinsik tur: barcha ruxsat etilgan teglar HTMLElement beradi.
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      className={className}
      id={id}
      aria-label={label}
      aria-labelledby={labelledBy}
      {...attrs}
    >
      {children}
    </Tag>
  );
}
