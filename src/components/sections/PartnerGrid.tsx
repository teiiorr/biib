import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { PartnerLogoPlaceholder } from "@/components/brand/Placeholder";
import { PARTNERS, pick } from "@/content";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/**
 * Logotiplar teng törda. Haqiqiy logotip kulrangdan rangga ötadi —
 * brend qayta böyalmaydi, faqat filtr olinadi. Örinbosarlar rangsiz.
 */
export function PartnerGrid({ className }: { className?: string }) {
  const t = useTranslations("partners");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;

  return (
    <ul className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4", className)}>
      {PARTNERS.map((partner, index) => {
        const name = partner.name ? pick(partner.name, locale) : t("slot", { n: index + 1 });

        const logo = partner.logo ? (
          <Image
            src={partner.logo}
            alt={name}
            width={200}
            height={72}
            className={cn(
              "h-auto w-full max-w-40 grayscale transition-[filter] duration-[var(--dur-base)]",
              "group-hover:grayscale-0 group-focus-visible:grayscale-0",
            )}
          />
        ) : (
          <PartnerLogoPlaceholder name={name} />
        );

        const shell = [
          "panel group grid h-24 place-items-center rounded-md px-4",
          "shadow-[inset_0_0_0_0.5px_var(--separator)] hover:shadow-[inset_0_0_0_0.5px_var(--line-gold-strong)]",
          "transition-colors duration-[var(--dur-fast)]",
        ].join(" ");

        return (
          <li key={partner.id}>
            {partner.href ? (
              <a
                href={partner.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${name} (${tCommon("opensInNewTab")})`}
                className={cn(shell, "hover:bg-sunken")}
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
