import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

interface FieldGroupProps {
  readonly id: string;
  readonly title: string;
  readonly className?: string;
  readonly children: ReactNode;
}

/** Shakl guruhi: sirtdagi karta, ixcham h2 (asbob zichligi: sahifa sarlavhasidan ancha kichik). */
export function FieldGroup({ id, title, className, children }: FieldGroupProps) {
  return (
    <section id={id} className={cx("admin-group", className)} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="t-h3 text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}
