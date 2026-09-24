import type { ReactNode } from "react";

import { GirihStar } from "@/components/ornament/GirihStar";
import { cn } from "@/lib/cn";
import type { AspectRatio } from "@/lib/ornament/ratio";

import { MediaFrame } from "./MediaFrame";

export interface PortraitFrameProps {
  readonly ratio?: AspectRatio;
  /** Portret (img/picture). Boʻlmasa tuzilmaviy oʻrinbosar: sokin belgi va faqat lavozim. */
  readonly children?: ReactNode;
  readonly role: string;
  readonly className?: string;
}

/** Portret ramkasi. Surat yoʻq (pending) boʻlsa hech qanday yuz oʻylab topilmaydi: tinch zamin va lavozim. */
export function PortraitFrame({ ratio = "3:4", children, role, className }: PortraitFrameProps) {
  const pending = children === undefined || children === null;
  return (
    <MediaFrame ratio={ratio} hairline className={cn("portrait-frame", className)}>
      {pending ? (
        <div className="portrait-frame-placeholder" data-status="pending">
          <GirihStar symmetry={8} size={20} ring={false} className="portrait-frame-mark" />
          <span className="t-small text-ink-2">{role}</span>
        </div>
      ) : (
        children
      )}
    </MediaFrame>
  );
}
