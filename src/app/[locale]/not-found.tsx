import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/LinkButton";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="section">
      <div className="page">
        <div className="read mx-auto text-center">
          <h1 className="text-title1">{t("title")}</h1>
          <p className="mt-4 text-body text-label-secondary">{t("lead")}</p>
          <div className="mt-8 flex justify-center">
            <LinkButton href="/" size="lg">
              {t("cta")}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
