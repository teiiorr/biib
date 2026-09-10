"use client";

import type { ButtonHTMLAttributes } from "react";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";
import { cn } from "@/lib/cn";

/** Haqiqiy tugma: yuboriş, qayta uriniş. Havolalar uçun LinkButton bor. */
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
