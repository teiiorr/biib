"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";
import { cn } from "@/lib/cn";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
    ButtonVariantProps {
  asChild?: boolean;
  /** Belgi matndan oldin. Yuklaniş paytida örnini spinner egallaydi. */
  icon?: ReactNode;
  /**
   * Prop berilgan bölsa, boşidayoq 16 px joy ajratiladi —
   * yuklaniş boşlanganda tugma kengligi sakramaydi.
   */
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  icon,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  const slot = loading !== undefined || icon !== undefined;

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      disabled={disabled || loading}
      {...props}
    >
      {slot ? (
        <span className="grid h-4 w-4 shrink-0 place-items-center">
          {loading ? <Spinner /> : icon}
        </span>
      ) : null}
      {children}
    </Comp>
  );
}
