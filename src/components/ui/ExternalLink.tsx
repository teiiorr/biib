import type { ReactNode } from "react";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";
import { VisuallyHidden } from "./VisuallyHidden";

export interface ExternalLinkProps {
  readonly href: string;
  /** Ekran oʻquvchisi uchun izoh, masalan «tashqi saytda ochiladi». */
  readonly hint: string;
  readonly showIcon?: boolean;
  readonly className?: string;
  readonly children: ReactNode;
}

export function ExternalLink({
  href,
  hint,
  showIcon = true,
  className,
  children,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-tint underline decoration-1 underline-offset-4 birlashma:font-bold birlashma:no-underline",
        className,
      )}
    >
      {children}
      {showIcon ? <Icon name="external" size={16} /> : null}
      <VisuallyHidden> ({hint})</VisuallyHidden>
    </a>
  );
}
