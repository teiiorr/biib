import { useTranslations } from "next-intl";
import { Icon } from "@/components/brand/Icon";
import { MarkerUnderline } from "@/components/brand/MarkerUnderline";
import { Reveal } from "@/components/brand/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";

/** Boş ekran: katta sarlavha, ikki çaqiruv, osmon va belgilar. */
export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative isolate overflow-hidden">

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
            <LinkButton href="/contacts" size="lg" confetti>
              {t("ctaPrimary")}
            </LinkButton>
            <LinkButton href="/projects" size="lg" variant="secondary">
              {t("ctaSecondary")}
            </LinkButton>
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
