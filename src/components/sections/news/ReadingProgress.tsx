"use client";

import { useEffect, useRef } from "react";

import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";

interface ReadingProgressProps {
  readonly dict: Dictionary["common"]["reading"];
  /** Oʻqiladigan matn bloki (maqola tanasi) id si. */
  readonly targetId: string;
}

/**
 * Oʻqish jarayoni: ekran tepasida 2 px ingichka chiziq. Har kadrda faqat transform oʻzgaradi;
 * React qayta chizilmaydi, aria qiymati foiz oʻzgargandagina yangilanadi.
 */
export function ReadingProgress({ dict, targetId }: ReadingProgressProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    const target = document.getElementById(targetId);
    if (!bar || !target) return;
    let frame = 0;
    let lastPercent = -1;
    const update = (): void => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const passed = Math.min(
        Math.max(-rect.top + window.innerHeight * 0.3, 0),
        Math.max(total, 1),
      );
      const progress = total > 0 ? passed / total : 1;
      bar.style.setProperty("--progress", progress.toFixed(4));
      const percent = Math.round(progress * 100);
      if (percent !== lastPercent) {
        lastPercent = percent;
        bar.setAttribute("aria-valuenow", String(percent));
        bar.setAttribute("aria-valuetext", fill(dict.value, { percent }));
      }
    };
    const schedule = (): void => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [dict.value, targetId]);

  return (
    <div
      ref={ref}
      className="reading-progress"
      role="progressbar"
      aria-label={dict.progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      aria-valuetext={fill(dict.value, { percent: 0 })}
    />
  );
}
