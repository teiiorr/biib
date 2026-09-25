import type { HTMLAttributes } from "react";

/* Radix VisuallyHidden mijoz komponenti edi: har sahifaga Primitive bilan ≈ 1 KB JS olib kirardi.
   Bir xil natija oddiy sr-only span bilan, serverda. */
export function VisuallyHidden({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={className ? `sr-only ${className}` : "sr-only"} {...rest} />;
}
