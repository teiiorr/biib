import type { Locale } from "@/i18n/locales";
import { NEWS } from "./news";
import { PEOPLE } from "./people";
import { PROJECTS } from "./projects";
import type { Localized, NewsItem, Person, ProjectItem } from "./types";

export { NEWS } from "./news";
export { PEOPLE } from "./people";
export { PROJECTS } from "./projects";
export { PARTNERS } from "./partners";
export { ORG } from "./org";
export { ORG_TEXT } from "./org-text";
export type * from "./types";

/** Beş tilli maydondan joriy tilnikini oladi. */
export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/** Yangi sanadan eskisiga. Röyxat kiçik, har safar saralaş arzon. */
function byDateDesc(a: NewsItem, b: NewsItem): number {
  return b.date.localeCompare(a.date);
}

export function allNews(): readonly NewsItem[] {
  return [...NEWS].sort(byDateDesc);
}

export function latestNews(count: number): readonly NewsItem[] {
  return allNews().slice(0, count);
}

export function findNews(slug: string): NewsItem | undefined {
  return NEWS.find((item) => item.slug === slug);
}

export function relatedNews(slug: string, count: number): readonly NewsItem[] {
  return allNews()
    .filter((item) => item.slug !== slug)
    .slice(0, count);
}

export function peopleOf(kind: Person["kind"]): readonly Person[] {
  return PEOPLE.filter((person) => person.kind === kind);
}

export function flagshipProject(): ProjectItem {
  const found = PROJECTS.find((project) => project.flagship);
  if (!found) throw new Error("PROJECTS: flagship: true bölgan loyiha yöq");
  return found;
}

export function otherProjects(): readonly ProjectItem[] {
  return PROJECTS.filter((project) => !project.flagship);
}
