"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { ArtSlot } from "@/content/types";
import { cx } from "@/lib/cx";
import { StickerClip, type StickerShape } from "./StickerClip";

export interface StickerProps {
  readonly shape?: StickerShape;
  /** Boʻyoq rangi (art-1…art-7); matn shu rangning matn tokenida. */
  readonly paint?: ArtSlot;
  /** Gradus, ±2 bilan cheklanadi; faqat Birlashmada qoʻllanadi. */
  readonly rotate?: number;
  readonly className?: string;
  readonly children: ReactNode;
}

type RevealState = "pending" | "done" | null;

function clampRotation(value: number): number {
  return Math.max(-2, Math.min(2, value));
}

/* Bir xil DOM: Atlasda oddiy belgi, Birlashmada qirqilgan qogʻoz stiker (ui.css). */
export function Sticker({
  shape = "ticket",
  paint = "art-2",
  rotate = 0,
  className,
  children,
}: StickerProps) {
  /* url(#…) ichida faqat xavfsiz belgilar qolsin. */
  const clipId = `sticker-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ref = useRef<HTMLSpanElement>(null);
  const [reveal, setReveal] = useState<RevealState>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const root = document.documentElement;
    const still =
      root.getAttribute("data-motion") === "off" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible) {
        setReveal("done");
        observer.disconnect();
      } else {
        setReveal("pending");
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style = {
    "--sticker-rotate": `${clampRotation(rotate)}deg`,
    "--sticker-clip": `url(#${clipId})`,
    "--sticker-paint": `var(--${paint})`,
    "--sticker-ink": `var(--${paint}-text)`,
  } as CSSProperties;

  return (
    <span
      ref={ref}
      className={cx("ui-sticker", className)}
      data-shape={shape}
      data-reveal={reveal ?? undefined}
      style={style}
    >
      <StickerClip id={clipId} shape={shape} />
      <span className="ui-sticker-paper">
        <span className="ui-sticker-fill" aria-hidden="true" />
        <span className="ui-sticker-label t-label text-trim">{children}</span>
        <span className="ui-sticker-corner" aria-hidden="true" />
      </span>
    </span>
  );
}
