"use client";

import { useRef, type ComponentProps, type MouseEvent } from "react";
import { Link } from "@/i18n/navigation";
import { buttonVariants, type ButtonVariantProps } from "./button-variants";
import { burstConfetti } from "@/lib/confetti";
import { cn } from "@/lib/cn";

/**
 * Tugma körinişidagi havola.
 *
 * Ataylab Radix Slot işlatilmaydi: server komponentidan mijoz komponenti
 * (Link) bola sifatida uzatilganda u avval "lazy" bölib keladi va Slot uni
 * element deb tanimay xato beradi. Bu yerda Link toʻgʻridan-toʻgʻri
 * çizilyapti, şuning uçun bunday holat umuman yöq.
 */
export type LinkButtonProps = ComponentProps<typeof Link> &
  ButtonVariantProps & {
    /** Faqat sahifadagi asosiy çaqiruvda. */
    confetti?: boolean;
  };

export function LinkButton({
  className,
  variant,
  size,
  confetti = false,
  onClick,
  ...props
}: LinkButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (confetti) burstConfetti(ref.current ?? event.currentTarget);
    onClick?.(event);
  }

  return (
    <Link
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleClick}
      {...props}
    />
  );
}
