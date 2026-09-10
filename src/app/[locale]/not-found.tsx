import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/LinkButton";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="section-y">
      <div className="page-w page-x flex flex-col gap-6">
        <span aria-hidden="true" className="block h-1.5 w-14 rounded-full bg-coral-ink" />
        <h1 className="text-[clamp(2rem,5vw,3rem)]">{t("title")}</h1>
        <p className="max-w-xl text-[1.08rem] text-ink-2">{t("lead")}</p>
        <div className="flex justify-end">
          <LinkButton href="/" size="lg">
            {t("cta")}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
