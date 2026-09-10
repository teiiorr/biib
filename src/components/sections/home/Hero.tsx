import { useTranslations } from "next-intl";
import { Blob } from "@/components/brand/Blob";
import { Doodle } from "@/components/brand/Doodle";
import { Icon } from "@/components/brand/Icon";
import { MarkerUnderline } from "@/components/brand/MarkerUnderline";
import { Reveal } from "@/components/brand/Reveal";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

/** Boş ekran: katta sarlavha, ikki çaqiruv, osmon va belgilar. */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Blob
          name="sky"
          tone="text-blue-soft"
          className="-right-[38%] -top-[34%] h-[30rem] w-[30rem] sm:-right-[30%] sm:-top-[46%] sm:h-[54rem] sm:w-[54rem] lg:-right-[16%]"
        />
        <Blob
          name="pebble"
          tone="text-sun-soft"
          className="-left-[42%] top-[42%] h-[24rem] w-[24rem] sm:-left-[34%] sm:top-[28%] sm:h-[36rem] sm:w-[36rem] lg:-left-[18%]"
        />
        <Doodle name="cloud" className="drift absolute left-[5%] top-[14%] h-14 w-14 text-blue-light/50 sm:h-16 sm:w-16" strokeWidth={2.2} />
        <Doodle name="spark" className="twinkle absolute right-[9%] top-[13%] h-8 w-8 text-sun" />
        <Doodle name="spark" className="twinkle absolute right-[22%] top-[38%] h-5 w-5 text-coral/75" />
        <Doodle name="spark" className="twinkle absolute left-[16%] top-[34%] h-6 w-6 text-grape/70" />
        <Doodle name="squiggle" className="absolute bottom-[16%] left-[8%] h-11 w-11 text-grass/45" strokeWidth={2.2} />
        <Doodle name="wave" className="absolute bottom-[22%] right-[7%] h-10 w-14 text-blue/30" strokeWidth={2.2} />
        <Doodle name="spark" className="twinkle absolute bottom-[12%] right-[30%] h-4 w-4 text-sun/80" />
      </div>

      <div className="page-w page-x flex min-h-[clamp(28rem,68svh,42rem)] flex-col items-center justify-center py-16 text-center sm:py-20">
        <Reveal pop>
          <h1 className="mx-auto max-w-[18ch] text-[clamp(2.35rem,6.6vw,4.4rem)]">
            {t("titleStart")}{" "}
            <MarkerUnderline accent="sun" delay={420}>
              {t("titleAccent")}
            </MarkerUnderline>
          </h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mx-auto mt-7 max-w-[52ch] text-[1.1rem] leading-relaxed text-ink-2 sm:text-[1.18rem]">
            {t("subtitle")}
          </p>
        </Reveal>

        <Reveal delay={260} pop>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" confetti>
              <Link href="/contacts">{t("ctaPrimary")}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/projects">{t("ctaSecondary")}</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <a
            href="#flagship"
            className="group mt-12 inline-flex min-h-11 items-center gap-2.5 rounded-btn px-1 text-[0.95rem] font-semibold text-ink-muted transition-colors duration-200 hover:text-blue-deep focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-blue transition-transform duration-300 ease-[var(--ease-pop)] group-hover:translate-y-1">
              <Icon name="chevron-down" className="h-4 w-4" />
            </span>
            {t("scrollCue")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
