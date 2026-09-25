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
  /** Telefonda joriy band yashiriladi (ostidagi h1 aynan shu): yoʻl ikki qatorga boʻlinmaydi. */
  readonly collapseCurrent?: boolean;
  readonly className?: string;
}

export function Breadcrumbs({
  items,
  label,
  collapseCurrent = false,
  className,
}: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className={cn("t-small text-ink-2", className)}>
      {/* -ms-1: birinchi havolaning ichki boʻshligʻi qaytariladi, matn toʻr chetidan boshlanadi. */}
      <ol className="-ms-1 flex flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li
            key={item.href}
            className={cn(
              "inline-flex items-center gap-1",
              collapseCurrent && item.current && "max-md:hidden",
            )}
          >
            {index > 0 ? <Icon name="chevron-right" size={16} className="text-ink-3" /> : null}
            {item.current ? (
              <span aria-current="page" className="inline-flex min-h-11 items-center px-1 text-ink">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="inline-flex min-h-11 min-w-11 items-center px-1 hover:text-ink"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
