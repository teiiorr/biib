"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { Girih } from "@/components/brand/Texture";
import { ArchKeystone, IslimiSpandrel } from "@/components/brand/Ornament";
import type { Accent } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Karta — ravoq. Tepasi Samarqand darvozasidek uçli arkka aylanadi:
 * muqova arkning içiga egiladi, cho'qqida kalit toş, yelkalarida
 * islimi novdasi turadi. Rangi şişaning öz tonidan keladi.
 *
 * Üstidan muz pardasi (.frost) yotadi va skrollda eriydi — Apple
 * uslubidagi harakat, ammo backdrop-filter ga tegilmaydi.
 *
 * Tuzilişi ikki qatlam: taşqi ".ravoq" öramasi ark maskasini va soyani
 * saqlaydi (mask outset soyani qirqadi, şuning uçun soya alohida),
 * içki şişa yuzasi esa kontent va bezaklarni tutadi. Sıçkon ortidan
 * samosvet nuri yuradi — koordinata CSS özgaruvçisiga rAF bilan
 * yoziladi, React qayta render qilmaydi.
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

    // currentTarget hodisa tugagaç tozalanadi — rAF dan oldin olamiz.
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
        } as CSSProperties
      }
      className={cn(
        "ravoq group relative flex flex-col",
        interactive && "cursor-pointer",
        className,
      )}
    >
      {/* Ark şaklidagi kötariliş soyasi — maskadan taşqarida. */}
      <span aria-hidden="true" className="ravoq-shadow" />

      {/* İçki şişa yuzasi: ark maskasi, kontent va bezaklar şu yerda. */}
      <div
        style={{ containerType: "inline-size" } as CSSProperties}
        className={cn(
          "glass glass-card glass-card--ravoq card-light relative z-[1] flex flex-1 flex-col overflow-hidden rounded-xl",
          "transition-transform duration-[420ms] ease-[var(--ease-magnet)]",
          "group-hover:-translate-y-1.5 focus-within:-translate-y-1.5 group-active:scale-[0.985]",
        )}
      >
        {/* Ravoq toji ostida samosvet nuri — ark zonasida yigʻiladi. */}
        <span aria-hidden="true" className="ravoq-crownlight" />

        {/* Samosvet toniga bo'yalgan girih suv belgisi. */}
        <Girih className="girih--gem opacity-[0.07]" />

        {/* Karta içidagi barça matn va rasm. */}
        <div className="relative z-10 flex h-full flex-col">{children}</div>

        {/* Eriydigan muz — kontent üstida, bezaklar tagida. */}
        <span aria-hidden="true" className="frost z-20" />

        {/* Ravoqning oltin qirrasi. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 80"
          preserveAspectRatio="none"
          fill="none"
          className="ravoq-edge z-30"
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

        <ArchKeystone className="absolute left-1/2 top-[4px] z-30 w-[18px] -translate-x-1/2" />
        <IslimiSpandrel
          side="left"
          className="absolute left-[7px] top-[calc(var(--ravoq-h,74px)-46px)] z-30 w-9"
        />
        <IslimiSpandrel
          side="right"
          className="absolute right-[7px] top-[calc(var(--ravoq-h,74px)-46px)] z-30 w-9"
        />
      </div>
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
