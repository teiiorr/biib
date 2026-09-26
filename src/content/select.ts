import type { Locale } from "@/i18n/locales";
import type { PageKey } from "@/i18n/routes";
import type { ContentSnapshot } from "./snapshot";
import type {
  Artwork,
  Contacts,
  ContentStatus,
  Localized,
  Milestone,
  NewsArticle,
  Partner,
  Person,
  Project,
} from "./types";
import type { UpopShot } from "./upop-gallery";

/*
 * Nusxadan oʻqish qoidalari: sof funksiyalar, tarmoq va keshsiz. Sahifalar ularni content/index.ts
 * orqali, skriptlar va testlar esa bundled.ts bilan toʻgʻridan-toʻgʻri chaqiradi.
 */

export function selectProjects(s: ContentSnapshot): readonly Project[] {
  return s.projects;
}

/** Bosh loyiha (UPOP TREND): bosh sahifa boʻlimi va loyiha sahifasi shu yozuvni koʻrsatadi. */
export function selectFlagship(s: ContentSnapshot): Project | null {
  return s.projects.find((p) => p.flagship) ?? null;
}

/** UPOP TREND galereyasi: boʻsh boʻlsa boʻlim chizilmaydi. */
export function selectUpopGallery(s: ContentSnapshot): readonly UpopShot[] {
  return s.upopGallery;
}

export function selectNews(s: ContentSnapshot): readonly NewsArticle[] {
  return s.news;
}

export function selectNewsSlugs(s: ContentSnapshot): readonly string[] {
  return s.news.map((n) => n.slug);
}

export function selectArticle(s: ContentSnapshot, slug: string): NewsArticle | null {
  return s.news.find((n) => n.slug === slug) ?? null;
}

/** Oldingi va keyingi maqola (sanaga koʻra). */
export function selectNeighbours(
  s: ContentSnapshot,
  slug: string,
): { previous: NewsArticle | null; next: NewsArticle | null } {
  const index = s.news.findIndex((n) => n.slug === slug);
  const count = s.news.length;
  // Halqa: birinchining oldingisi oxirgisi — maqola navigatsiyasida yarim qator boʻsh qolmaydi.
  if (index < 0 || count < 2) return { previous: null, next: null };
  return {
    previous: s.news[(index - 1 + count) % count] ?? null,
    next: s.news[(index + 1) % count] ?? null,
  };
}

export function selectExperts(s: ContentSnapshot): readonly Person[] {
  return s.experts;
}

export function selectLeadership(s: ContentSnapshot): readonly Person[] {
  return s.leadership;
}

export function selectPartners(s: ContentSnapshot): readonly Partner[] {
  return s.partners;
}

/** Faqat tasdiqlangan hamkorlar; oltitadan kam boʻlsa bosh sahifada boʻlim chiqmaydi (15.2.6). */
export function selectConfirmedPartners(s: ContentSnapshot): readonly Partner[] {
  return s.partners.filter((p) => p.status === "confirmed" && p.name && p.logo);
}

export function selectContacts(s: ContentSnapshot): Contacts {
  return s.contacts;
}

/** Rozilik yozuvi toʻliq boʻlgan tasdiqlangan ishlar (25.4.1). */
export function selectArtworks(s: ContentSnapshot): readonly Artwork[] {
  return s.artworks.filter((a) => a.status === "confirmed" && a.consent.parent && a.consent.child);
}

export function selectMilestones(s: ContentSnapshot): readonly Milestone[] {
  return s.milestones;
}

export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

/** Sahifa tarkibida qoralama yoki tasdiqlanmagan yozuv bormi: noindex va sitemap uchun. */
export function pageContentStatus(statuses: readonly ContentStatus[]): ContentStatus {
  if (statuses.includes("pending")) return "pending";
  if (statuses.includes("draft")) return "draft";
  return "confirmed";
}

/** Sahifadagi eng «xom» yozuv holati: noindex va sitemap sanalari shu orqali hal boʻladi (18.1). */
export function statusForPage(s: ContentSnapshot, key: PageKey, slug?: string): ContentStatus {
  switch (key) {
    case "home":
      return pageContentStatus([
        ...s.projects.map((p) => p.status),
        ...s.news.map((n) => n.status),
      ]);
    case "about":
      return pageContentStatus(s.milestones.map((m) => m.status));
    case "projects":
      return pageContentStatus(s.projects.map((p) => p.status));
    case "news":
      return pageContentStatus(s.news.map((n) => n.status));
    case "newsItem":
      return (slug ? selectArticle(s, slug)?.status : undefined) ?? "draft";
    case "experts":
      return pageContentStatus(s.experts.map((p) => p.status));
    case "leadership":
      return pageContentStatus(s.leadership.map((p) => p.status));
    case "partners":
      return s.partners.length ? pageContentStatus(s.partners.map((p) => p.status)) : "pending";
    case "contacts": {
      const c = s.contacts;
      return pageContentStatus([c.address.status, c.phones.status, c.email.status, c.hours.status]);
    }
    case "privacy":
      return "draft";
  }
}

export interface PendingItem {
  readonly area: string;
  readonly id: string;
  readonly status: ContentStatus;
  readonly note: string;
}

/** verify.mjs uchun: tasdiq kutayotgan yozuvlar roʻyxati (ogohlantirish, xato emas). */
export function listPendingContent(s: ContentSnapshot): readonly PendingItem[] {
  const out: PendingItem[] = [];
  for (const p of s.projects) {
    if (p.status !== "confirmed")
      out.push({ area: "projects", id: p.key, status: p.status, note: "matn" });
    for (const [field, fact] of [
      ["place", p.place],
      ["schedule", p.schedule],
      ["teacher", p.teacher],
    ] as const) {
      if (fact.status === "pending")
        out.push({ area: "projects", id: `${p.key}.${field}`, status: "pending", note: field });
    }
    if (p.cost.status === "pending")
      out.push({ area: "projects", id: `${p.key}.cost`, status: "pending", note: "cost" });
    for (const [field, media] of [
      ["loop", p.media.loop],
      ["film", p.media.film],
    ] as const) {
      if (media.status !== "confirmed")
        out.push({
          area: "projects",
          id: `${p.key}.${field}`,
          status: media.status,
          note: "video",
        });
    }
  }
  for (const n of s.news) {
    if (n.status !== "confirmed")
      out.push({ area: "news", id: n.slug, status: n.status, note: "matn va sana" });
    if (n.cover.status !== "confirmed")
      out.push({ area: "news", id: `${n.slug}.cover`, status: n.cover.status, note: "muqova" });
  }
  for (const person of [...s.experts, ...s.leadership]) {
    if (person.status !== "confirmed")
      out.push({ area: person.kind, id: person.id, status: person.status, note: "ism, surat" });
  }
  if (!s.partners.length)
    out.push({ area: "partners", id: "list", status: "pending", note: "roʻyxat" });
  const c = s.contacts;
  for (const [k, v] of [
    ["address", c.address],
    ["phones", c.phones],
    ["email", c.email],
    ["telegram", c.telegram],
    ["hours", c.hours],
    ["map", c.map],
  ] as const) {
    if (v.status !== "confirmed") out.push({ area: "contacts", id: k, status: "pending", note: k });
  }
  for (const m of s.milestones) {
    if (m.status !== "confirmed")
      out.push({ area: "history", id: m.id, status: m.status, note: "sana" });
  }
  if (!s.artworks.length)
    out.push({ area: "gallery", id: "artworks", status: "pending", note: "rozilik bilan ishlar" });
  return out;
}
