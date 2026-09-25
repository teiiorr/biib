import { cva, type VariantProps } from "class-variance-authority";
import type { IconSize } from "@/components/icons/Icon";

export const buttonVariants = cva(
  "ui-button relative inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        primary: "bg-tint text-on-tint hover:bg-tint-hover",
        glass: "material text-material-ink",
        ghost: "text-ink",
        link: "text-tint underline decoration-1 underline-offset-4",
      },
      size: {
        "40": "t-label",
        "48": "t-label-l",
        "56": "t-label-l",
      },
    },
    defaultVariants: { variant: "primary", size: "48" },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
export type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

/* §8 IX.1 juftliklari: 40 → 16, 48 → 20, 56 → 24. */
export const BUTTON_ICON_SIZE: Record<ButtonSize, IconSize> = {
  "40": 16,
  "48": 20,
  "56": 24,
};
