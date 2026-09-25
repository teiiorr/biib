import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface PullQuoteProps {
  readonly children: ReactNode;
  /** Manba yoki muallif; figcaption sifatida. */
  readonly attribution?: ReactNode;
  /** Qoʻshtirnoqlar tilga qarab: «…» (uz, ru) yoki “…” (en). */
  readonly openMark?: string;
  readonly closeMark?: string;
  readonly cite?: string;
  readonly className?: string;
}

export function PullQuote({
  children,
  attribution,
  openMark = "«",
  closeMark = "»",
  cite,
  className,
}: PullQuoteProps) {
  return (
    <figure className={cn("ui-pullquote border-t border-accent-art pt-6", className)}>
      <blockquote {...(cite ? { cite } : {})}>
        <p className="ui-pullquote-text t-h2 text-ink">
          {openMark}
          {children}
          {closeMark}
        </p>
      </blockquote>
      {attribution ? (
        <figcaption className="t-small mt-4 text-ink-3">{attribution}</figcaption>
      ) : null}
    </figure>
  );
}
