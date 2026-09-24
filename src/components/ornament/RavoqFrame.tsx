import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { RavoqRatio } from "@/lib/ornament/ravoq";
import { GirihStar } from "./GirihStar";
import { Ravoq } from "./Ravoq";

export interface RavoqFrameProps {
  readonly ratio?: RavoqRatio;
  /** Portret (img/picture). Boʻlmasa tuzilmaviy oʻrinbosar: monogramma va faqat lavozim. */
  readonly children?: ReactNode;
  readonly role: string;
  readonly className?: string;
}

/** Portret ramkasi. Surat yoʻq (pending) boʻlsa hech qanday yuz oʻylab topilmaydi: naqsh va lavozim. */
export function RavoqFrame({ ratio = "3:4", children, role, className }: RavoqFrameProps) {
  const pending = children === undefined || children === null;
  return (
    <Ravoq ratio={ratio} className={cn("text-accent-art", className)}>
      {pending ? (
        <div className="ravoq-placeholder" data-status="pending">
          <GirihStar symmetry={10} size={64} ring={false} className="text-accent-art" />
          <span className="t-small text-ink-2">{role}</span>
        </div>
      ) : (
        children
      )}
    </Ravoq>
  );
}
