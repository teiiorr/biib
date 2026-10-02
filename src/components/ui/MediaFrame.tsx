import type { CSSProperties, ReactNode } from "react";

import { MediaReveal, type MediaRevealProps } from "@/components/motion/MediaReveal";
import { ratioCss, type AspectRatio } from "@/lib/aspect-ratio";
import { cx } from "@/lib/cx";

export interface MediaFrameProps {
  readonly ratio?: AspectRatio;
  /** Kirish va parallaks; berilmasa ramka harakatsiz. */
  readonly motion?: MediaRevealProps;
  readonly className?: string;
  /** Qorongʻi surat yoki video: ustidan oʻtgan oyna tungi ohangga oʻtadi (useSurfaceTone). */
  readonly tone?: "dark";
  readonly children?: ReactNode;
}

export function MediaFrame({ ratio = "3:2", motion, className, tone, children }: MediaFrameProps) {
  const vars = { "--frame-ratio": ratioCss(ratio) } as CSSProperties;
  return (
    <div className={cx("media-frame", className)} style={vars} data-ratio={ratio} data-tone={tone}>
      <div className="media-frame-media">{children}</div>
      {motion ? <MediaReveal {...motion} /> : null}
    </div>
  );
}
