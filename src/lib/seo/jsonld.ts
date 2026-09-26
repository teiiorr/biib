import { t } from "@/content";
import type { Contacts, NewsArticle, Person } from "@/content/types";
import type { Dictionary } from "@/i18n/dictionaries";
import { LOCALE_META, type Locale } from "@/i18n/locales";
import { absoluteUrl, siteUrl } from "@/lib/site";

type JsonLdObject = Record<string, unknown>;

export function organizationJsonLd(input: {
  locale: Locale;
  dict: Dictionary;
  contacts: Contacts;
}): JsonLdObject {
  const { dict, contacts, locale } = input;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: dict.common.brand.name,
    /* Ustavdagi rasmiy nomlar (1.10-band): oʻzbek, rus va ingliz tillarida. */
    legalName: "Bolalar ijodkorligi ijodiy birlashmasi",
    alternateName: [
      "Творческое объединение детского творчества",
      "Creative Association of Children’s Creativity",
    ],
    url: absoluteUrl(`/${locale}`),
    logo: absoluteUrl("/icon.png"),
    ...(contacts.address.status === "confirmed" && contacts.address.value
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: t(contacts.address.value, locale),
            postalCode: "100011",
            addressLocality: "Tashkent",
            addressCountry: "UZ",
          },
        }
      : {}),
    ...(contacts.phones.status === "confirmed" && contacts.phones.value?.length
      ? { telephone: contacts.phones.value.map((p) => p.replace(/\s/g, "")) }
      : {}),
    ...(contacts.email.status === "confirmed" && contacts.email.value
      ? { email: contacts.email.value }
      : {}),
    sameAs: contacts.socials.filter((s) => s.status === "confirmed").map((s) => s.href),
  };
}

export function websiteJsonLd(input: { locale: Locale; dict: Dictionary }): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.dict.meta.siteName,
    url: siteUrl(),
    inLanguage: LOCALE_META[input.locale].htmlLang,
  };
}

export function breadcrumbJsonLd(
  items: ReadonlyArray<{ readonly name: string; readonly path: string }>,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Faqat tasdiqlangan maqola uchun (18.1). */
export function newsArticleJsonLd(input: {
  article: NewsArticle;
  locale: Locale;
  dict: Dictionary;
  path: string;
}): JsonLdObject | null {
  const { article, locale, dict, path } = input;
  if (article.status !== "confirmed") return null;
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title[locale],
    description: article.lead[locale],
    datePublished: article.date,
    inLanguage: LOCALE_META[locale].htmlLang,
    mainEntityOfPage: absoluteUrl(path),
    ...(article.cover.status === "confirmed" && article.cover.src
      ? { image: [absoluteUrl(article.cover.src)] }
      : {}),
    author: { "@type": "Organization", name: dict.common.brand.name },
    publisher: {
      "@type": "Organization",
      name: dict.common.brand.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
    },
  };
}

/** Faqat ismi tasdiqlangan shaxs uchun. */
export function personJsonLd(input: {
  person: Person;
  locale: Locale;
  dict: Dictionary;
}): JsonLdObject | null {
  const { person, locale, dict } = input;
  if (person.status !== "confirmed" || !person.name) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name[locale],
    jobTitle: person.role[locale],
    worksFor: { "@type": "Organization", name: dict.common.brand.name },
    ...(person.photo ? { image: absoluteUrl(person.photo) } : {}),
    ...(person.email ? { email: person.email } : {}),
  };
}
