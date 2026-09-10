import { Icon } from "@/components/brand/Icon";
import { Reveal } from "@/components/brand/Reveal";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * Bölim boşi: H2 va ixtiyoriy kiriş. Sarlavha ustida hеç narsa turmaydi.
 * "Barçasi" havolasi röyxatdan keyin, SectionMore da.
 */
export function SectionHead({
  heading,
  lead,
  className,
  id,
}: {
  heading: string;
  lead?: string;
  className?: string;
  id?: string;
}) {
  return (
    <Reveal className={cn("flex flex-col gap-4", className)}>
      <h2 id={id} className="text-[clamp(1.9rem,4.4vw,2.85rem)]">
        {heading}
      </h2>
      {lead ? <p className="max-w-2xl text-[1.06rem] text-ink-2">{lead}</p> : null}
    </Reveal>
  );
}

/**
 * Röyxat ostidagi "barçasi" havolalari. Öngda turadi — sahifadagi
 * boşqa amallar bilan bir çiziqda bölsin.
 */
export function SectionMore({
  links,
  delay = 0,
  className,
}: {
  links: readonly { href: StaticPathname; label: string }[];
  delay?: number;
  className?: string;
}) {
  return (
    <Reveal delay={delay} className={cn("flex flex-wrap justify-end gap-x-7 gap-y-2", className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "group inline-flex min-h-11 items-center gap-2 rounded-btn pl-1",
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
      ))}
    </Reveal>
  );
}
