import { cva, type VariantProps } from "class-variance-authority";

/**
 * Törtta köriniş — §6.5. Beşinçisi öylab topilmaydi.
 * Amal rangi — lavanda gradient (§16.3); oltin matn va belgi uçun qoladi.
 */
export const buttonVariants = cva(
  [
    "tap inline-flex select-none items-center justify-center gap-2",
    "rounded-md font-semibold whitespace-nowrap",
    "transition-[background-color,background-image,color,scale,box-shadow]",
    "duration-[var(--dur-fast)] ease-[var(--ease-magnet)]",
    "active:scale-[0.97]",
    "disabled:pointer-events-none disabled:opacity-40",
    "aria-disabled:pointer-events-none aria-disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-[image:var(--pop-btn)] text-accent-contrast",
          "shadow-[inset_0_0.5px_0_0_rgb(242_228_198/0.28)]",
          "hover:bg-[image:var(--pop-btn-hover)]",
        ],
        secondary: [
          "bg-fill-secondary text-label",
          "shadow-[inset_0_0_0_0.5px_var(--line-gold)]",
          "hover:bg-fill-secondary-hover",
        ],
        glass: "glass glass--thin rounded-md text-label hover:brightness-110",
        plain: "text-accent-text hover:bg-fill-secondary",
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
