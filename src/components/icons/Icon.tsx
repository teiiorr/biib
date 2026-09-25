import { cx } from "@/lib/cx";
import type { IconName } from "./paths";

export type IconSize = 16 | 20 | 24;

export interface IconProps {
  readonly name: IconName;
  readonly size?: IconSize;
  /** Berilsa belgi maʼno tashiydi: role="img" va nom; aks holda bezak (aria-hidden). */
  readonly label?: string;
  readonly className?: string;
}

/* Chizma layoutdagi spritdan (IconSprite): yoʻl maʼlumotlari mijoz JS iga kirmaydi. */
export function Icon({ name, size = 20, label, className }: IconProps) {
  const meaningful = typeof label === "string" && label.length > 0;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx("shrink-0", className)}
      data-icon={name}
      {...(meaningful ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <use href={`#i-${name}`} strokeWidth={1.75} />
    </svg>
  );
}
