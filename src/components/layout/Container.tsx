import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

interface ContainerProps {
  readonly as?: "div" | "section" | "header" | "footer" | "nav";
  readonly grid?: boolean;
  readonly id?: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Toʻr konteyneri: 1312 px + chetlar; grid=true 4/8/12 ustun beradi. */
export function Container({
  as: Tag = "div",
  grid = false,
  id,
  className,
  children,
}: ContainerProps) {
  return (
    <Tag id={id} className={cx("container-site", grid && "grid-site", className)}>
      {children}
    </Tag>
  );
}
