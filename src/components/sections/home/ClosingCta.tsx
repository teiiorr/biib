import { useTranslations } from "next-intl";
import { Reveal } from "@/components/brand/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";

/** Yakuniy çaqiruv. Sahifadagi ikkinçi va sönggi konfetti şu yerda. */
export function ClosingCta() {
  const t = useTranslations("home.closing");

  return (
    <section className="section-y relative isolate overflow-hidden" aria-labelledby="home-closing">

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
          <LinkButton href="/contacts" size="lg" confetti>
            {t("cta")}
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
