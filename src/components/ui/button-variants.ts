import { cva, type VariantProps } from "class-variance-authority";

/**
 * Tugma körinişlari. Server komponentlarda <Link> ni şu sinflar bilan
 * bezaş uçun alohida faylda turadi.
 */
export const buttonVariants = cva(
  [
    "inline-flex select-none items-center justify-center gap-2.5",
    "rounded-btn font-display font-bold leading-none",
    "transition-[transform,box-shadow,background-color,border-color,color]",
    "duration-200 ease-[var(--ease-pop)]",
    "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-55",
    "active:translate-y-0 active:scale-[0.99]",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-blue-cta text-ink-inverse shadow-cta",
          "hover:-translate-y-0.5 hover:bg-blue-cta-hover hover:shadow-cta-hover",
        ],
        secondary: [
          "border-2 border-blue-cta bg-surface/75 text-blue-deep",
          "hover:-translate-y-0.5 hover:bg-surface hover:shadow-soft",
        ],
        quiet: [
          "border border-line bg-transparent text-ink-2",
          "hover:border-line-strong hover:bg-blue-soft hover:text-ink",
        ],
        link: ["text-blue-deep underline-offset-4 hover:underline"],
      },
      size: {
        md: "h-11 px-5 text-[0.98rem]",
        lg: "h-13 px-7 text-[1.06rem]",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
