"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { ArchKeystone, IslimiSpandrel } from "@/components/brand/Ornament";
import type { Accent } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Karta — tekis, premium. Silueti bir xil to'g'ri to'rtburchak, şuning
 * uçun barça karta ideal tekis turadi; tepasida esa ingiçka oltin
 * ravoq toji — cho'qqida kalit toş, yelkalarida islimi. Özbek ruhi
 * tekislikni buzmaydi.
 *
 * Oltin ràm hover da yorishadi. Sıçkon ortidan samosvet nuri yuradi:
 * koordinata CSS özgaruvçisiga rAF bilan yoziladi, React qayta render
 * qilmaydi. Karta skrollda toj bilan yigʻiladi (--asm).
 */
export function GemCard({
  accent,
  children,
  className,
  interactive = false,
  as = "article",
}: {
  accent: Accent;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "article" | "div" | "li";
}) {
  const Tag = as;
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || frame.current) return;
    const element = event.currentTarget;
    const box = element.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty("--mx", `${x}px`);
      element.style.setProperty("--my", `${y}px`);
      frame.current = 0;
    });
  }

  return (
    <Tag
      onPointerMove={onPointerMove}
      style={
        {
          "--gem": `var(--${accent})`,
          "--gem-line": `var(--${accent}-line)`,
          containerType: "inline-size",
        } as CSSProperties
      }
      className={cn(
        "ravoq gem-card card-light group relative isolate flex flex-col overflow-hidden rounded-2xl",
        "glass glass-card",
        "transition-[transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-magnet)]",
        "hover:-translate-y-1.5 focus-within:-translate-y-1.5 active:scale-[0.994]",
        interactive && "cursor-pointer",
        className,
      )}
    >
      {/* Ravoq toji ostida samosvet nuri. */}
      <span aria-hidden="true" className="ravoq-crownlight" />

      {/* Kontent. */}
      <div className="relative z-10 flex h-full flex-col">{children}</div>

      {/* Oltin ravoq toji — tekis kartaning tepasidagi bezak. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 120 80"
        preserveAspectRatio="none"
        fill="none"
        className="ravoq-edge z-20"
      >
        <path
          d="M0 58C6 33 33 8 60 0C87 8 114 33 120 58"
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 61C6 37 33 12 60 4C87 12 114 37 120 61"
          stroke="var(--gold-hi)"
          strokeWidth={0.75}
          strokeOpacity={0.4}
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <ArchKeystone className="absolute left-1/2 top-[4px] z-20 w-[18px] -translate-x-1/2" />
      <IslimiSpandrel side="left" className="absolute left-[7px] top-[calc(var(--ravoq-h,66px)-46px)] z-20 w-9" />
      <IslimiSpandrel side="right" className="absolute right-[7px] top-[calc(var(--ravoq-h,66px)-46px)] z-20 w-9" />
    </Tag>
  );
}

/** Röyxat belgisi — kiçik samosvet nuqtasi. */
export function GemBullet() {
  return (
    <span
      aria-hidden="true"
      className="mt-[0.55rem] block h-2 w-2 shrink-0 rounded-pill bg-[var(--gem-line,var(--gem))]"
    />
  );
}
