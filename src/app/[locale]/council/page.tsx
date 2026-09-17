import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { PeopleRoster } from "@/components/sections/PeopleRoster";
import { peopleOf } from "@/content";

export async function generateMetadata(
  props: PageProps<"/[locale]/council">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("council.title"), description: t("meta.councilDescription") };
}

export default async function UcouncilPage({ params }: PageProps<"/[locale]/council">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "council" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />
      <section className="section pt-4">
        <div className="page">
          <PeopleRoster people={peopleOf("council")} roleLabel={t("roleLabel")} />
        </div>
      </section>
    </>
  );
}
