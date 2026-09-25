import type { ReactNode } from "react";

import type { MediaRevealProps } from "@/components/motion/MediaReveal";
import { GirihStar } from "@/components/ornament/GirihStar";
import { cn } from "@/lib/cn";
import type { AspectRatio } from "@/lib/ornament/ratio";

import { MediaFrame } from "./MediaFrame";

export interface PortraitFrameProps {
  readonly ratio?: AspectRatio;
  /** Portret (img/picture). Boʻlmasa tuzilmaviy oʻrinbosar: sokin zamin va kichik belgi. */
  readonly children?: ReactNode;
  /** Portretlar yumshoq ochiladi (yuzda «yuklanish» hissi boʻlmasin), guruhda doira ritmida. */
  readonly motion?: MediaRevealProps;
  readonly className?: string;
}

/**
 * Portret ramkasi. Surat yoʻq (pending) boʻlsa yuz oʻylab topilmaydi: tinch zamin va kichik belgi.
 * Lavozim kartaning imzosida bir marta yoziladi, ramka ichida takrorlanmaydi (Art. XV).
 */
export function PortraitFrame({ ratio = "4:5", children, motion, className }: PortraitFrameProps) {
  const pending = children === undefined || children === null;
  return (
    <MediaFrame
      ratio={ratio}
      hairline={!pending}
      className={cn("portrait-frame", className)}
      {...(motion ? { motion } : {})}
    >
      {pending ? (
        <div className="portrait-frame-placeholder" data-status="pending">
          <GirihStar symmetry={8} size={20} ring={false} className="portrait-frame-mark" />
        </div>
      ) : (
        children
      )}
    </MediaFrame>
  );
}
