import { useLocale, useTranslations } from "next-intl";
import { VideoFrame } from "@/components/brand/VideoFrame";
import { ExternalButton } from "@/components/ui/LinkButton";
import { pick } from "@/content";
import type { ProjectItem } from "@/content/types";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/cn";

/**
 * Loyihalar sahifasidagi lavha. Bir xil kartalar qatori bölmasin deb
 * ritm almaşadi: media bir safar çapda, bir safar öngda; mediasi yöq
 * loyiha kengroq matn ustuni oladi.
 */
export function ProjectFeature({
  project,
  index,
  first,
}: {
  project: ProjectItem;
  index: number;
  first: boolean;
}) {
  const t = useTranslations("projects");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const flip = index % 2 === 1;
  const hasMedia = Boolean(project.video);

  return (
    <section
      aria-label={pick(project.name, locale)}
      className={cn("page section", !first && "border-t border-separator")}
    >
      <div className={cn("grid gap-8", hasMedia && "lg:grid-cols-2 lg:gap-12")}>
        {hasMedia && project.video ? (
          <div className={cn("flex flex-col gap-2", flip && "lg:order-last")}>
            <VideoFrame
              src={project.video.src}
              poster={project.video.poster}
              posterAlt={pick(project.video.posterAlt, locale)}
              label={t("playVideo")}
            />
            <p className="text-footnote text-label-secondary">{t("videoCaption")}</p>
          </div>
        ) : null}

        <div className={cn(!hasMedia && "read")}>
          <h2 className="text-title1">{pick(project.name, locale)}</h2>
          <p className="mt-2 text-headline text-label">{pick(project.tagline, locale)}</p>

          <div className="mt-5 flex flex-col gap-4 text-body text-label-secondary">
            {pick(project.body, locale).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-6 border-t border-separator pt-5">
            <h3 className="text-subhead font-semibold text-label">{t("factsLabel")}</h3>
            <ul className="mt-2 flex flex-col gap-1 text-callout text-label-secondary">
              {pick(project.facts, locale).map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
          </div>

          {project.external ? (
            <div className="mt-6 flex justify-end">
              <ExternalButton
                href={project.external.href}
                newTabLabel={tCommon("opensInNewTab")}
                size="lg"
              >
                {t("visitSite")}
              </ExternalButton>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
