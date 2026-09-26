import type { ReactNode } from "react";

import type { MediaRevealProps } from "@/components/motion/MediaReveal";
import type { AspectRatio } from "@/lib/aspect-ratio";
import { cx } from "@/lib/cx";

import { BrandLogo } from "./BrandLogo";
import { MediaFrame } from "./MediaFrame";

export interface PortraitFrameProps {
  readonly ratio?: AspectRatio;
  /** Portret (img/picture). Boʻlmasa tinch zamin va markazda birlashma belgisi. */
  readonly children?: ReactNode;
  /** Portretlar yumshoq ochiladi (yuzda «yuklanish» hissi boʻlmasin), guruhda doira ritmida. */
  readonly motion?: MediaRevealProps;
  readonly className?: string;
}

/**
 * Portret ramkasi. Surat yoʻq (pending) boʻlsa yuz oʻylab topilmaydi: tinch zamin va belgi.
 * Lavozim kartaning imzosida bir marta yoziladi, ramka ichida takrorlanmaydi (Art. XV).
 */
export function PortraitFrame({ ratio = "4:5", children, motion, className }: PortraitFrameProps) {
  const pending = children === undefined || children === null;
  return (
    <MediaFrame
      ratio={ratio}
      className={cx("portrait-frame", className)}
      {...(motion ? { motion } : {})}
    >
      {pending ? (
        <div className="portrait-frame-placeholder" data-status="pending" aria-hidden="true">
          <BrandLogo alt="" size={48} />
        </div>
      ) : (
        children
      )}
    </MediaFrame>
  );
}
