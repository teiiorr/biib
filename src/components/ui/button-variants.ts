import { cva, type VariantProps } from "class-variance-authority";

/**
 * Törtta köriniş — §6.5. Beşinçisi öylab topilmaydi.
 * Alohida faylda: server komponentlarda <Link> ni şu sinflar bilan bezaymiz.
 */
export const buttonVariants = cva(
  [
    "tap inline-flex select-none items-center justify-center gap-2",
    "rounded-md font-semibold whitespace-nowrap",
    "transition-[background-color,color,scale] duration-[var(--dur-fast)] ease-[var(--ease-standard)]",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-40",
    "aria-disabled:pointer-events-none aria-disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-contrast hover:bg-accent-hover active:bg-accent-pressed",
        secondary:
          "bg-fill-secondary text-label hover:bg-fill-secondary-hover active:bg-fill-secondary-hover",
        glass: "glass glass--thin text-label hover:brightness-[0.97]",
        plain: "text-accent hover:bg-accent-wash",
      },
      size: {
        sm: "h-8 px-3 text-footnote",
        md: "h-10 px-4 text-callout",
        lg: "h-12 px-5 text-headline",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
