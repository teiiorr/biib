import Link from "next/link";
import { Icon } from "@/components/icons/Icon";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  readonly href: string;
  readonly label: string;
  readonly current?: boolean;
}

export interface BreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[];
  /** nav uchun nom, masalan «Siz shu yerdasiz». */
  readonly label: string;
  readonly className?: string;
}

export function Breadcrumbs({ items, label, className }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={cn("t-small text-ink-2", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center gap-1">
            {index > 0 ? <Icon name="chevron-right" size={16} className="text-ink-3" /> : null}
            {item.current ? (
              <span aria-current="page" className="py-3 text-ink">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="py-3 hover:text-ink">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
