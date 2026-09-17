import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/LinkButton";

export function ClosingCta() {
  const t = useTranslations("home.closing");

  return (
    <section className="section bg-elevated" aria-labelledby="home-closing">
      <div className="page">
        <h2 id="home-closing" className="max-w-[18ch] text-title1">
          {t("heading")}
        </h2>
        <p className="read mt-4 text-body text-label-secondary">{t("lead")}</p>

        <div className="mt-8 flex justify-end">
          <LinkButton href="/contacts" size="lg">
            {t("cta")}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
