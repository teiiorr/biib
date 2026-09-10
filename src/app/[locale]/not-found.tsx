import { useTranslations } from "next-intl";
import { Doodle } from "@/components/brand/Doodle";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <section className="section-y">
      <div className="page-w page-x flex flex-col items-start gap-6">
        <Doodle name="swirl" className="h-14 w-14 text-coral" strokeWidth={2.4} />
        <h1 className="text-[clamp(2rem,5vw,3rem)]">{t("title")}</h1>
        <p className="max-w-xl text-[1.08rem] text-ink-2">{t("lead")}</p>
        <Button asChild size="lg">
          <Link href="/">{t("cta")}</Link>
        </Button>
      </div>
    </section>
  );
}
