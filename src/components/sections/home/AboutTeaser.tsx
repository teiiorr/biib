import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";

/** Biz haqimizda — tirik matn. Raqamli plaşkalar yöq. */
export function AboutTeaser() {
  const t = useTranslations("home.about");

  return (
    <section className="section-y relative isolate overflow-hidden" aria-labelledby="home-about">

      <div className="page-w page-x">
        <Reveal>
          <h2 id="home-about" className="max-w-3xl text-[clamp(1.9rem,4.4vw,2.85rem)]">
            {t("heading")}
          </h2>
        </Reveal>

        <div className="mt-7 grid gap-x-12 gap-y-5 text-[1.06rem] leading-relaxed text-ink-2 lg:grid-cols-3 lg:gap-y-0 sm:text-[1.1rem]">
          <Reveal delay={90}>
            <p>{t("p1")}</p>
          </Reveal>
          <Reveal delay={170}>
            <p>{t("p2")}</p>
          </Reveal>
          <Reveal delay={250}>
            <p className="text-ink">{t("p3")}</p>
          </Reveal>
        </div>

        <Reveal delay={330} pop className="mt-10 flex justify-end">
          <LinkButton href="/about" variant="secondary" size="lg">
            {t("cta")}
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
