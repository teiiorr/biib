import { useTranslations } from "next-intl";
import { Blob } from "@/components/brand/Blob";
import { Doodle } from "@/components/brand/Doodle";
import { Reveal } from "@/components/brand/Reveal";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

/** Yakuniy çaqiruv. Sahifadagi ikkinçi va sönggi konfetti şu yerda. */
export function ClosingCta() {
  const t = useTranslations("home.closing");

  return (
    <section className="section-y relative isolate overflow-hidden" aria-labelledby="home-closing">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Blob name="drop" tone="text-blue-soft" className="-right-[34%] -top-[18%] h-[24rem] w-[24rem] sm:-right-[18%] sm:-top-[24%] sm:h-[38rem] sm:w-[38rem]" />
        <Blob name="hill" tone="text-pink-soft" className="-bottom-[28%] -left-[34%] h-[22rem] w-[22rem] sm:-bottom-[36%] sm:-left-[14%] sm:h-[32rem] sm:w-[32rem]" />
        <Doodle name="spark" className="twinkle absolute left-[12%] top-[18%] h-7 w-7 text-sun" />
        <Doodle name="spark" className="twinkle absolute right-[16%] bottom-[22%] h-5 w-5 text-coral" />
        <Doodle name="zigzag" className="absolute right-[10%] top-[26%] h-8 w-11 text-grass/45" strokeWidth={2.2} />
        <Doodle name="cloud" className="drift absolute bottom-[14%] left-[26%] h-12 w-12 text-blue-light/45" strokeWidth={2.2} />
      </div>

      <div className="page-w page-x flex flex-col items-center gap-7 py-6 text-center">
        <Reveal pop>
          <h2 id="home-closing" className="max-w-3xl text-[clamp(2rem,5.2vw,3.2rem)]">
            {t("heading")}
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="max-w-xl text-[1.08rem] leading-relaxed text-ink-2">{t("lead")}</p>
        </Reveal>

        <Reveal delay={230} pop>
          <Button asChild size="lg" confetti>
            <Link href="/contacts">{t("cta")}</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
