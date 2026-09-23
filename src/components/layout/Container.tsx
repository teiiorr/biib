import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

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
    <Tag id={id} className={cn("container-site", grid && "grid-site", className)}>
      {children}
    </Tag>
  );
}
