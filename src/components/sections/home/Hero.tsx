import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/LinkButton";

/**
 * Sarlavhada rangli söz yöq (§4.6): urgʻu ölçam va boşliq bilan beriladi.
 * Ekranning yagona muallif jesti — skrollda barning holat almaşiği.
 */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="page pb-12 pt-10 md:pb-16 md:pt-16">
      <h1 className="max-w-[16ch] text-title1 md:text-display">
        {t("titleStart")} {t("titleAccent")}
      </h1>

      <p className="read mt-5 text-body text-label-secondary">{t("subtitle")}</p>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
        <LinkButton href="/projects" variant="secondary" size="lg">
          {t("ctaSecondary")}
        </LinkButton>
        <LinkButton href="/contacts" size="lg">
          {t("ctaPrimary")}
        </LinkButton>
      </div>
    </section>
  );
}
