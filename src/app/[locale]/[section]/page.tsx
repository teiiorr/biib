import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutPage } from "@/components/sections/about/AboutPage";
import { ContactsPage } from "@/components/sections/contacts/ContactsPage";
import { ExpertsPage } from "@/components/sections/experts/ExpertsPage";
import { LeadershipPage } from "@/components/sections/leadership/LeadershipPage";
import { NewsListPage } from "@/components/sections/news/NewsListPage";
import { PartnersPage } from "@/components/sections/partners/PartnersPage";
import { PrivacyPage } from "@/components/sections/privacy/PrivacyPage";
import { ProjectsPage } from "@/components/sections/projects/ProjectsPage";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { LOCALES, type Locale } from "@/i18n/locales";
import { SECTION_KEYS, resolveSection, sectionSegment, type SectionKey } from "@/i18n/routes";
import { buildMetadata } from "@/lib/seo/metadata";
import { statusForPage } from "@/lib/seo/status";

export const dynamicParams = false;

/** 8 boʻlim × 5 til = 40 sahifa; slug segmentlari boshqa faylda. */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    SECTION_KEYS.map((key) => ({ locale, section: sectionSegment(locale, key) })),
  );
}

interface PageProps {
  readonly params: Promise<{ locale: Locale; section: string }>;
}

type SectionPage = (props: { locale: Locale; dict: Dictionary }) => React.ReactNode;

const PAGES: Record<SectionKey | "news", SectionPage> = {
  about: AboutPage,
  projects: ProjectsPage,
  news: NewsListPage,
  experts: ExpertsPage,
  leadership: LeadershipPage,
  partners: PartnersPage,
  contacts: ContactsPage,
  privacy: PrivacyPage,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, section } = await params;
  const key = resolveSection(locale, section);
  if (!key) return {};
  return buildMetadata({ locale, key, dict: getDictionary(locale), status: statusForPage(key) });
}

export default async function Page({ params }: PageProps) {
  const { locale, section } = await params;
  const key = resolveSection(locale, section);
  if (!key) notFound();
  const Component = PAGES[key];
  return <Component locale={locale} dict={getDictionary(locale)} />;
}
