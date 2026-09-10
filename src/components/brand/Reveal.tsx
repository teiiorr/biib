"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { observeReveal } from "@/lib/reveal";

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Ketma-ket çiqiş uçun kutiş, ms. */
  delay?: number;
  /** Ösib öta çiqiş — bölim boşidagi bitta jest uçun. */
  pop?: boolean;
  as?: "div" | "section" | "li" | "article" | "span" | "header" | "figure";
}

export function Reveal({ children, className, delay = 0, pop = false, as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => observeReveal(ref.current), []);

  const Tag = as;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      data-reveal=""
      data-reveal-pop={pop ? "" : undefined}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
