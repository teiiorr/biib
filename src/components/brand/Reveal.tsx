"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { observeReveal } from "@/lib/reveal";
import { cn } from "@/lib/cn";

/**
 * Skrollda pastdan çiqadi. Bölimga bitta jest: har blokni alohida
 * "uçirib" yuboriş ekranni beqaror qiladi.
 *
 * `delay` — JS kuzatuvçili yöl uçun (transition-delay). `index` — skroll
 * çizigʻili yöl uçun: har element boşlaniş nuqtasi --reveal-i böyiça
 * suriladi, şunda tördagi kartalar ketma-ket kötariladi.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  index = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Ketma-ket çiqiş uçun kutiş, ms (JS zaxira yöli). */
  delay?: number;
  /** Tördagi örin — skroll çizigʻili staggering uçun. */
  index?: number;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => observeReveal(ref.current), []);

  const Tag = as;

  const style =
    delay || index
      ? ({
          ...(delay ? { "--reveal-delay": `${delay}ms` } : null),
          ...(index ? { "--reveal-i": index } : null),
        } as CSSProperties)
      : undefined;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal=""
      style={style}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
