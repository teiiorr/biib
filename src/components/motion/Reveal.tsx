"use client";

import { useRef, type ReactNode } from "react";
import { DURATION, EASE } from "@/lib/motion/constants";
import { doiraStaggerFn, doiraUnit } from "@/lib/motion/doira";
import { motionAllowed } from "@/lib/motion/prefs";
import { isLitePerf } from "@/lib/perf";
import { belowViewport } from "@/lib/motion/viewport";
import { watchPending } from "@/lib/motion/watchdog";
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
  /** ScrollTrigger start, sukut "top 88%". */
  readonly start?: string;
  /** Qoʻshimcha kechikish, s. */
  readonly delay?: number;
  /** Audit va test belgilari (data-*), oʻramga oʻtkaziladi. */
  readonly attrs?: Readonly<Record<`data-${string}`, string>>;
  readonly label?: string;
  readonly labelledBy?: string;
}

/**
 * reveal-rise v3 (egasining talabi: harakat kuchliroq va skrollning ikki yoʻnalishida): blok pastdan
 * kirganda pastdan, yuqoridan qaytganda yuqoridan koʻtariladi (opacity 0→1, y ±48, masshtab 0.96→1,
 * doira ritmi); ekrandan chiqqanda chiqish tomoniga yashirinadi va qaytganda yana kiradi. Faqat opacity
 * — visibility emas: yashirin blok ham ekran oʻquvchida oʻqiladi. Ekranda turgan blok birinchi
 * kadrda yashirilmaydi; qoʻriqchi (watchdog) trigger oʻtkazib yuborilsa ham ochadi. Kuchsiz qurilmada
 * (data-perf="lite") masofa yarim, masshtab yoʻq. Matn doim DOM da.
 */
export function Reveal({
  as = "div",
  children,
  className,
  id,
  stagger = false,
  distance = 24,
  start = "top 88%",
  delay = 0,
  attrs,
  label,
  labelledBy,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefs = useMotionPrefs();
  const allowed = prefs.ready && motionAllowed(prefs);
  const compact = prefs.breakpoint === "compact";

  useEngineEffect(
    ref,
    ({ gsap, ScrollTrigger }) => {
      const root = ref.current;
      if (!root || !allowed) return;
      const targets: Element[] = stagger ? Array.from(root.children) : [root];
      if (!targets.length) return;
      const lite = isLitePerf();
      const shift = Math.round(distance * 2 * (compact ? 0.66 : 1) * (lite ? 0.5 : 1));
      const hidden = (dir: 1 | -1): gsap.TweenVars => ({
        opacity: 0,
        y: dir * shift,
        scale: lite ? 1 : 0.96,
      });
      const rhythm = stagger ? doiraStaggerFn(doiraUnit(targets.length)) : 0;
      const show = (dir: 1 | -1): void => {
        gsap.fromTo(targets, hidden(dir), {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: DURATION.reveal,
          ease: EASE.out,
          delay,
          stagger: rhythm,
          overwrite: true,
          clearProps: "transform,opacity",
        });
      };
      const hide = (dir: 1 | -1): void => {
        gsap.to(targets, { ...hidden(dir), duration: 0.35, ease: "power1.in", overwrite: true });
      };
      // Birinchi kadrda ekranda turgan blok yashirilmaydi: faqat pastdagilar boshlangʻich holatda.
      let skipFirst = !belowViewport(root, 1);
      if (!skipFirst) gsap.set(targets, hidden(1));
      const watch = watchPending(root, skipFirst ? [] : targets, () => show(1));
      const trigger = ScrollTrigger.create({
        trigger: root,
        start,
        end: "bottom 12%",
        onEnter: () => {
          watch.started();
          if (skipFirst) skipFirst = false;
          else show(1);
        },
        onEnterBack: () => {
          skipFirst = false;
          show(-1);
        },
        onLeave: () => {
          skipFirst = false;
          hide(-1);
        },
        onLeaveBack: () => {
          skipFirst = false;
          hide(1);
        },
      });
      return () => {
        watch.dispose();
        trigger.kill();
      };
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
