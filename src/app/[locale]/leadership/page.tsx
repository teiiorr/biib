import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { PeopleRoster } from "@/components/sections/PeopleRoster";
import { peopleOf } from "@/content";

export async function generateMetadata(
  props: PageProps<"/[locale]/leadership">,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale });
  return { title: t("leadership.title"), description: t("meta.leadershipDescription") };
}

export default async function UleadershipPage({ params }: PageProps<"/[locale]/leadership">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "leadership" });

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} />
      <section className="section pt-4">
        <div className="page">
          <PeopleRoster people={peopleOf("leadership")} roleLabel={t("roleLabel")} />
        </div>
      </section>
    </>
  );
}
