import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";
import { cn } from "@/lib/cn";

/**
 * Yönaliş — havola, amal — tugma. Körinişi bir xil, semantikasi toʻgʻri.
 * Server komponentlarda işlaydi: klient qismi kerak emas.
 */
export function LinkButton({
  href,
  children,
  className,
  variant,
  size,
  icon,
}: {
  href: StaticPathname;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
} & ButtonVariantProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
      {icon ? <span className="grid h-4 w-4 shrink-0 place-items-center">{icon}</span> : null}
      {children}
    </Link>
  );
}

/** Taşqi manzil. Yangi oynada oçiladi, ekran öqigiçga şu aytiladi. */
export function ExternalButton({
  href,
  children,
  className,
  variant,
  size,
  newTabLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  newTabLabel: string;
} & ButtonVariantProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
      <span className="sr-only">({newTabLabel})</span>
    </a>
  );
}
