import type { CSSProperties, ReactNode } from "react";

import { GirihStar } from "@/components/ornament/GirihStar";
import { cn } from "@/lib/cn";
import { ratioCss, type AspectRatio } from "@/lib/ornament/ratio";

export interface MediaFrameProps {
  readonly ratio?: AspectRatio;
  /** 1 px oltin chiziq qirradan 6 px ichkarida: radius 12 − 6 = 6 (Art. VI.2). */
  readonly hairline?: boolean;
  /** Chap yuqori burchakda 16 px sakkiz karrali girih yulduzi (soʻzana burchak belgisi). */
  readonly corner?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly children?: ReactNode;
}

/**
 * Toʻrtburchak media ramkasi: nisbat qulflangan, 12 px radius, ichidagi media kesiladi.
 * Ikkala dizaynda bitta DOM; Birlashma qogʻoz bosmani CSS bilan beradi (--frame-pad).
 */
export function MediaFrame({
  ratio = "3:2",
  hairline = false,
  corner = false,
  className,
  style,
  children,
}: MediaFrameProps) {
  const vars = { "--frame-ratio": ratioCss(ratio), ...style } as CSSProperties;
  return (
    <div className={cn("media-frame", className)} style={vars} data-ratio={ratio}>
      <div className="media-frame-media">{children}</div>
      {hairline ? <span className="media-frame-line" aria-hidden="true" /> : null}
      {corner ? (
        <GirihStar symmetry={8} size={16} ring={false} className="media-frame-corner" />
      ) : null}
    </div>
  );
}
