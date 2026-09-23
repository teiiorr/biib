import Link from "next/link";
import type { ReactNode } from "react";
import type { IconName } from "@/components/icons/paths";
import { Button } from "./Button";
import type { ButtonSize, ButtonVariant } from "./button-variants";
import { VisuallyHidden } from "./VisuallyHidden";

export interface LinkButtonProps {
  readonly href: string;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly icon?: IconName;
  readonly iconPosition?: "start" | "end";
  /** Tashqi havola: yangi oynada, rel noopener, bodom uchli strelka va yashirin izoh. */
  readonly external?: boolean;
  /** Masalan «tashqi saytda ochiladi»; faqat external bilan oʻqiladi. */
  readonly externalHint?: string;
  readonly className?: string;
  readonly prefetch?: boolean;
  readonly children: ReactNode;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "48",
  icon,
  iconPosition = "start",
  external = false,
  externalHint,
  className,
  prefetch,
  children,
}: LinkButtonProps) {
  const resolvedIcon = external ? "external" : icon;
  const resolvedPosition = external ? "end" : iconPosition;
  const styleProps = {
    variant,
    size,
    ...(resolvedIcon ? { icon: resolvedIcon } : {}),
    iconPosition: resolvedPosition,
    ...(className ? { className } : {}),
  } as const;

  if (external) {
    return (
      <Button asChild {...styleProps}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <span className="text-trim">{children}</span>
          {externalHint ? <VisuallyHidden> ({externalHint})</VisuallyHidden> : null}
        </a>
      </Button>
    );
  }
  return (
    <Button asChild {...styleProps}>
      <Link href={href} {...(prefetch === undefined ? {} : { prefetch })}>
        <span className="text-trim">{children}</span>
      </Link>
    </Button>
  );
}
