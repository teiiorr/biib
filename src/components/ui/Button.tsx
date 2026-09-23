import { Slot, Slottable } from "@radix-ui/react-slot";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";
import { cn } from "@/lib/cn";
import {
  BUTTON_ICON_SIZE,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "./button-variants";
import { ButtonSpinner } from "./ButtonSpinner";
import { Tooltip } from "./Tooltip";

interface ButtonOwnProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly icon?: IconName;
  readonly iconPosition?: "start" | "end";
  readonly loading?: boolean;
  readonly disabled?: boolean;
  /** Oʻchirilgan sabab: tooltip sifatida koʻrsatiladi, tugma fokuslanadigan boʻlib qoladi. */
  readonly disabledReason?: string;
  readonly asChild?: boolean;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly ref?: Ref<HTMLButtonElement>;
}

type NativeProps = Omit<ComponentPropsWithoutRef<"button">, keyof ButtonOwnProps | "aria-label">;

/* Faqat belgili tugma nomsiz boʻlolmaydi: aria-label tur darajasida majburiy. */
export type ButtonProps = ButtonOwnProps &
  NativeProps &
  (
    | { readonly iconOnly: true; readonly "aria-label": string }
    | { readonly iconOnly?: false; readonly "aria-label"?: string }
  );

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "48",
    icon,
    iconPosition = "start",
    loading = false,
    disabled = false,
    disabledReason,
    asChild = false,
    className,
    children,
    iconOnly = false,
    onClick,
    type,
    ...rest
  } = props;

  const inactive = disabled || loading;
  const iconSize = BUTTON_ICON_SIZE[size];
  const Component = asChild ? Slot : "button";
  const iconSlot = iconOnly ? "only" : icon || loading ? iconPosition : undefined;
  const graphic = loading ? (
    <ButtonSpinner size={iconSize} />
  ) : icon ? (
    <Icon name={icon} size={iconSize} />
  ) : null;

  const element = (
    <Component
      {...rest}
      {...(asChild ? {} : { type: type ?? "button" })}
      className={cn(buttonVariants({ variant, size }), className)}
      data-variant={variant}
      data-size={size}
      data-icon={iconSlot}
      data-text={variant === "glass" ? "true" : undefined}
      aria-disabled={inactive ? "true" : undefined}
      aria-busy={loading ? "true" : undefined}
      /* Tooltip sababi bor boʻlsa tugma fokuslanadi, shuning uchun disabled atributi qoʻyilmaydi. */
      disabled={!asChild && disabled && !disabledReason ? true : undefined}
      onClick={inactive ? undefined : onClick}
    >
      {iconSlot === "only" ? (
        graphic
      ) : (
        <>
          {iconPosition === "start" ? graphic : null}
          {/* asChild da yorliq oʻrash tashqarida (LinkButton kabi), Slottable bolasi ildiz element boʻladi. */}
          {asChild ? (
            <Slottable>{children}</Slottable>
          ) : (
            <span className="text-trim">{children}</span>
          )}
          {iconPosition === "end" ? graphic : null}
        </>
      )}
    </Component>
  );

  if (disabled && disabledReason) {
    return <Tooltip content={disabledReason}>{element}</Tooltip>;
  }
  return element;
}
