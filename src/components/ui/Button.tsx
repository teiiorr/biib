import { Slot, Slottable } from "@radix-ui/react-slot";
import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";
import { Icon } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";
import { cx } from "@/lib/cx";
import { MAGNET } from "@/lib/motion/constants";
import {
  BUTTON_ICON_SIZE,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from "./button-variants";
import { ButtonSpinner } from "./ButtonSpinner";
import { DisabledTooltip } from "./DisabledTooltip";

interface ButtonOwnProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly icon?: IconName;
  /** Boshqa spritdagi belgi (masalan panelniki): icon oʻrnida, oʻsha oʻlcham va joyda chiziladi. */
  readonly graphic?: ReactNode;
  readonly iconPosition?: "start" | "end";
  readonly loading?: boolean;
  readonly disabled?: boolean;
  /** Nega oʻchiqligi: tooltip boʻlib chiqadi, tugma esa fokuslanadigan boʻlib qoladi. */
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
    graphic: customGraphic,
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
  const hasIcon = Boolean(icon || customGraphic);
  const iconSlot = iconOnly ? "only" : hasIcon || loading ? iconPosition : undefined;
  // Magnitni MotionProvider ichidagi umumiy tinglovchi boshqaradi, tugma faqat atribut orqali qatnashadi.
  const magnetic = inactive
    ? undefined
    : variant === "glass" && iconOnly
      ? String(MAGNET.icon)
      : (variant === "primary" || variant === "glass") && size !== "40"
        ? ""
        : undefined;
  const graphic = loading ? (
    <ButtonSpinner size={iconSize} />
  ) : icon ? (
    <Icon name={icon} size={iconSize} />
  ) : (
    (customGraphic ?? null)
  );

  const element = (
    <Component
      {...rest}
      {...(asChild ? {} : { type: type ?? "button" })}
      className={cx(buttonVariants({ variant, size }), className)}
      data-variant={variant}
      data-size={size}
      data-icon={iconSlot}
      data-text={variant === "glass" ? "true" : undefined}
      data-magnetic={magnetic}
      aria-disabled={inactive ? "true" : undefined}
      aria-busy={loading ? "true" : undefined}
      /* Tooltip sababi bor boʻlsa tugma fokuslanadi, shuning uchun disabled atributi qoʻyilmaydi. */
      disabled={!asChild && disabled && !disabledReason ? true : undefined}
      onClick={inactive ? undefined : onClick}
    >
      {iconSlot === "only"
        ? graphic
        : [
            /* Belgisiz tugmada boʻsh span qolmasin: flex gap yorliqni 4 px chetga surardi. */
            graphic && iconPosition === "start" ? <span key="start">{graphic}</span> : null,
            /* Slot faqat toʻgʻridan-toʻgʻri bolalar orasidan Slottable ni topadi: Fragment emas, massiv. */
            asChild ? (
              <Slottable key="label">{children}</Slottable>
            ) : (
              <span key="label" className="text-trim">
                {children}
              </span>
            ),
            graphic && iconPosition === "end" ? <span key="end">{graphic}</span> : null,
          ]}
    </Component>
  );

  if (disabled && disabledReason) {
    return <DisabledTooltip content={disabledReason}>{element}</DisabledTooltip>;
  }
  return element;
}
