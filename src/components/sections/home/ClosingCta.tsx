import { useTranslations } from "next-intl";
import { GoldText } from "@/components/brand/GoldText";
import { Reveal } from "@/components/brand/Reveal";
import { Aura } from "@/components/brand/Texture";
import { LinkButton } from "@/components/ui/LinkButton";

/** Yakuniy çaqiruv: sahifadagi ikkinçi va sönggi aura. */
export function ClosingCta() {
  const t = useTranslations("home.closing");

  return (
    <section className="section relative isolate overflow-hidden" aria-labelledby="home-closing">
      <Aura className="-bottom-[48%] -left-[16%] w-[min(80vw,660px)]" />

      <div className="page relative">
        <Reveal className="text-center">
          <h2 id="home-closing" className="mx-auto max-w-[18ch] text-title1">
            <GoldText>{t("heading")}</GoldText>
          </h2>
          <p className="read mx-auto mt-4 text-body text-label-secondary">{t("lead")}</p>
        </Reveal>

        <Reveal delay={140} className="mt-8 flex justify-center">
          <LinkButton href="/contacts" size="lg" className="w-full justify-center sm:w-auto">
            {t("cta")}
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}
