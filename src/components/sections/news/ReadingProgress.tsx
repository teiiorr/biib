"use client";

import { useEffect, useRef, useState } from "react";

import { Qalampir } from "@/components/ornament/Qalampir";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/format";

interface ReadingProgressProps {
  readonly dict: Dictionary["ornament"];
  readonly targetId: string;
}

/** Oʻqish jarayoni: toʻrt qalampir birin-ketin toʻladi (11.7). */
export function ReadingProgress({ dict, targetId }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const frame = useRef(0);
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const update = (): void => {
      frame.current = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const passed = Math.min(
        Math.max(-rect.top + window.innerHeight * 0.3, 0),
        Math.max(total, 1),
      );
      setProgress(total > 0 ? passed / total : 1);
    };
    const onScroll = (): void => {
      if (frame.current === 0) frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame.current);
    };
  }, [targetId]);
  const percent = Math.round(progress * 100);
  return (
    <div className="reading-progress">
      <Qalampir
        progress={progress}
        label={dict.qalampir}
        valueText={fill(dict.qalampirValue, { percent })}
      />
    </div>
  );
}
