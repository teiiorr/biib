import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { PartnerLogoPlaceholder } from "@/components/brand/Placeholder";
import { PARTNERS, pick } from "@/content";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/**
 * Logotiplar teng törda. Odatda kulrang, sıçkon ostida rangga kiradi —
 * brend qayta böyalmaydi, faqat filtr olinadi.
 */
export function PartnerGrid({ className }: { className?: string }) {
  const t = useTranslations("partners");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  return (
    <ul className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {PARTNERS.map((partner, index) => {
        const name = partner.name ? pick(partner.name, locale) : t("slot", { n: index + 1 });

        const logo = (
          <span
            className={cn(
              "block w-full max-w-[10rem] grayscale transition-[filter,opacity,transform] duration-300 ease-[var(--ease-micro)]",
              "opacity-85 group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0",
              "group-focus-visible:opacity-100 group-focus-visible:grayscale-0",
            )}
          >
            {partner.logo ? (
              <Image src={partner.logo} alt={name} width={200} height={72} className="h-auto w-full" />
            ) : (
              <PartnerLogoPlaceholder name={name} accent={partner.accent} />
            )}
          </span>
        );

        const shell =
          "group grid h-24 place-items-center rounded-card border border-line bg-surface px-5 shadow-soft transition-[transform,box-shadow] duration-300 ease-[var(--ease-pop)] sm:h-28";

        return (
          <li key={partner.id}>
            {partner.href ? (
              <a
                href={partner.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${name} (${tCommon("opensInNewTab")})`}
                className={cn(shell, "hover:-translate-y-1 hover:shadow-lift focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]")}
              >
                {logo}
              </a>
            ) : (
              <div className={shell} role="img" aria-label={name}>
                {logo}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
