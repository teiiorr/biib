"use client";

import { useEffect, useState, type ComponentType, type ReactElement } from "react";

import type { TooltipProps } from "./Tooltip";

interface DisabledTooltipProps {
  readonly content: string;
  readonly children: ReactElement;
}

/** Oʻchiq tugma sababi: Radix Tooltip faqat shunday tugma sahifada boʻlganda, brauzerda yuklanadi. */
export function DisabledTooltip({ content, children }: DisabledTooltipProps) {
  const [Impl, setImpl] = useState<ComponentType<TooltipProps> | null>(null);
  useEffect(() => {
    let cancelled = false;
    void import("./Tooltip").then((mod) => {
      if (!cancelled) setImpl(() => mod.Tooltip);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (!Impl) return children;
  return <Impl content={content}>{children}</Impl>;
}
