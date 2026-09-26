import type { CSSProperties, ReactNode } from "react";

import { MediaReveal, type MediaRevealProps } from "@/components/motion/MediaReveal";
import { ratioCss, type AspectRatio } from "@/lib/aspect-ratio";
import { cx } from "@/lib/cx";

export interface MediaFrameProps {
  readonly ratio?: AspectRatio;
  /** Kirish va parallaks (motion-plan 3.6, 3.7): berilmasa ramka harakatsiz. */
  readonly motion?: MediaRevealProps;
  readonly className?: string;
  /** Qorongʻi surat yoki video: ustidan oʻtgan oyna tungi ohangga oʻtadi (10.1.3, useSurfaceTone). */
  readonly tone?: "dark";
  readonly children?: ReactNode;
}

/** Toʻrtburchak media ramkasi: nisbat qulflangan, 12 px radius, ichidagi media kesiladi. */
export function MediaFrame({ ratio = "3:2", motion, className, tone, children }: MediaFrameProps) {
  const vars = { "--frame-ratio": ratioCss(ratio) } as CSSProperties;
  return (
    <div className={cx("media-frame", className)} style={vars} data-ratio={ratio} data-tone={tone}>
      <div className="media-frame-media">{children}</div>
      {motion ? <MediaReveal {...motion} /> : null}
    </div>
  );
}
