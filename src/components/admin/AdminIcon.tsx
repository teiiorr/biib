import type { IconSize } from "@/components/icons/Icon";
import type { IconName } from "@/components/icons/paths";
import { cx } from "@/lib/cx";

import { ADMIN_ICON_NAMES, type AdminIconName } from "./admin-icon-paths";

export type AnyIconName = IconName | AdminIconName;

interface AdminIconProps {
  readonly name: AnyIconName;
  readonly size?: IconSize;
  readonly className?: string;
}

const OWN: ReadonlySet<string> = new Set(ADMIN_ICON_NAMES);

/** Sayt spritidagi belgi ham, panelniki ham: har doim bezak, nomni yonidagi yorliq beradi. */
export function AdminIcon({ name, size = 20, className }: AdminIconProps) {
  const id = OWN.has(name) ? `ai-${name}` : `i-${name}`;
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
      aria-hidden="true"
    >
      <use href={`#${id}`} strokeWidth={1.75} />
    </svg>
  );
}
