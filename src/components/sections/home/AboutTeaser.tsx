import { useTranslations } from "next-intl";
import { Blob } from "@/components/brand/Blob";
import { Doodle } from "@/components/brand/Doodle";
import { Reveal } from "@/components/brand/Reveal";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

/** Biz haqimizda — tirik matn. Raqamli plaşkalar yöq. */
export function AboutTeaser() {
  const t = useTranslations("home.about");

  return (
    <section className="section-y relative isolate overflow-hidden" aria-labelledby="home-about">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Blob name="petal" tone="text-grass-soft" className="-left-[40%] top-[6%] h-[24rem] w-[24rem] sm:-left-[26%] sm:h-[36rem] sm:w-[36rem]" />
        <Doodle name="spark" className="twinkle absolute right-[10%] top-[14%] h-6 w-6 text-sun" />
        <Doodle name="wave" className="absolute bottom-[18%] right-[7%] h-9 w-12 text-blue/30" strokeWidth={2.2} />
        <Doodle name="squiggle" className="absolute bottom-[26%] left-[6%] h-9 w-9 text-coral/35" strokeWidth={2.2} />
      </div>

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

        <Reveal delay={330} pop>
          <Button asChild variant="secondary" size="lg" className="mt-10">
            <Link href="/about">{t("cta")}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
