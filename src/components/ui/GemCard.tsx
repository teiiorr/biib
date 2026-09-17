"use client";

import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { Girih } from "@/components/brand/Texture";
import type { Accent } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Karta. Rangi şişaning öz tonidan keladi — bu materialning qismi,
 * ustiga yopiştirilgan bezak emas.
 *
 * Sıçkon ortidan samosvet nuri yuradi. Koordinata CSS özgaruvçisiga
 * yoziladi va rAF bilan çegaralanadi: bir kadrda bir marta, React
 * qayta render qilmaydi.
 *
 * container-type berilgan — içidagi matn ekran emas, kartaning öz
 * kengligiga qarab ösadi. Şunda bir xil karta uç ustunda ham, bir
 * ustunda ham töğri körinadi.
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
          containerType: "inline-size",
        } as CSSProperties
      }
      className={cn(
        "glass glass-card card-light group relative isolate overflow-hidden rounded-xl",
        "transition-[transform,box-shadow] duration-[420ms] ease-[var(--ease-magnet)]",
        "hover:-translate-y-1.5 hover:shadow-modal",
        "focus-within:-translate-y-1.5 focus-within:shadow-modal",
        interactive && "cursor-pointer",
        className,
      )}
    >
      <Girih className="opacity-[0.05]" />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
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
