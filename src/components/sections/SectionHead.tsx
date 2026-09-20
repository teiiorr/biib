import { GoldText } from "@/components/brand/GoldText";
import { Link } from "@/i18n/navigation";
import type { StaticPathname } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/** Bölim boşi: H2, ostida qisqa oltin çiziq va ixtiyoriy kiriş. */
export function SectionHead({
  heading,
  lead,
  id,
  className,
}: {
  heading: string;
  lead?: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3 text-center", className)}>
      <h2 id={id} className="text-title1">
        <GoldText>{heading}</GoldText>
      </h2>
      {lead ? <p className="read text-body text-label-secondary">{lead}</p> : null}
    </div>
  );
}

/**
 * Röyxatdan keyingi havolalar — bölim öqida, markazda: sarlavha ham,
 * tör ham, davomi ham bitta marosim ustunida turadi. Strelka
 * qöyilmaydi — §12 da tugma va havola oxiridagi "→" taqiqlangan.
 */
export function SectionMore({
  links,
  className,
}: {
  links: readonly { href: StaticPathname; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-x-8 gap-y-1", className)}>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "tap inline-flex min-h-10 items-center rounded-sm px-1 text-callout font-semibold",
            "text-accent-text transition-colors duration-[var(--dur-fast)] hover:text-gold-hi",
          )}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
