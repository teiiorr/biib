"use client";

import { Slot } from "@radix-ui/react-slot";
import { useRef, type ButtonHTMLAttributes, type MouseEvent } from "react";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";
import { burstConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariantProps {
  asChild?: boolean;
  /** Faqat sahifadagi asosiy çaqiruvda. Ikkinçi tugmada emas. */
  confetti?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  confetti = false,
  onClick,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const Comp = asChild ? Slot : "button";

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (confetti) burstConfetti(ref.current ?? (event.currentTarget as HTMLElement));
    onClick?.(event);
  }

  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleClick}
      {...props}
    />
  );
}
