import type { ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import { Reveal } from "@/components/brand/Reveal";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * Bölim boşi: H2 va ixtiyoriy "Barçasi" havolasi.
 * Sarlavha ustida hеç narsa turmaydi — na yorliq, na plaşka.
 */
export function SectionHead({
  heading,
  lead,
  link,
  mark,
  className,
  id,
}: {
  heading: string;
  lead?: string;
  link?: { href: StaticPathname; label: string };
  /** Sarlavha yonidagi qölda çizilgan belgi. */
  mark?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <Reveal className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h2
          id={id}
          className="flex items-center gap-3 text-[clamp(1.9rem,4.4vw,2.85rem)]"
        >
          {heading}
          {mark}
        </h2>

        {link ? (
          <Link
            href={link.href}
            className={cn(
              "group inline-flex min-h-11 shrink-0 items-center gap-2 rounded-btn px-1",
              "font-display text-[1rem] font-bold text-blue-deep",
              "transition-colors duration-200 ease-[var(--ease-micro)] hover:text-blue-cta",
              "focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]",
            )}
          >
            {link.label}
            <Icon
              name="arrow-right"
              className="h-[1.1rem] w-[1.1rem] transition-transform duration-300 ease-[var(--ease-pop)] group-hover:translate-x-1"
            />
          </Link>
        ) : null}
      </div>

      {lead ? <p className="max-w-2xl text-[1.06rem] text-ink-2">{lead}</p> : null}
    </Reveal>
  );
}
