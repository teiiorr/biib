import type { Locale } from "@/i18n/locales";
import type { NewsSlug } from "@/i18n/routes";
import { CONTACTS } from "./contacts";
import { EXPERTS } from "./experts";
import { ARTWORKS } from "./gallery";
import { LEADERSHIP } from "./leadership";
import { MILESTONES } from "./milestones";
import { NEWS } from "./news";
import { PARTNERS } from "./partners";
import { PROJECTS } from "./projects";
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

/**
 * Kontentga faqat shu funksiyalar orqali kiriladi: keyin CMS kelsa sahifalar tegilmaydi.
 * Locale parametri hozircha butun yozuvni qaytaradi (matnlar Localized), tanlov komponentda.
 */
export function getProjects(_locale?: Locale): readonly Project[] {
  return PROJECTS;
}

/** Bosh loyiha (UPOP TREND): bosh sahifa boʻlimi va loyiha sahifasi shu yozuvni koʻrsatadi. */
export function getFlagship(): Project {
  const flagship = PROJECTS.find((p) => p.flagship);
  if (!flagship) throw new Error("Bosh loyiha topilmadi");
  return flagship;
}

export function getNews(_locale?: Locale): readonly NewsArticle[] {
  return NEWS;
}

export function getArticle(slug: NewsSlug): NewsArticle {
  const article = NEWS.find((n) => n.slug === slug);
  if (!article) throw new Error(`Maqola topilmadi: ${slug}`);
  return article;
}

/** Oldingi va keyingi maqola (sanaga koʻra); roʻyxat halqasimon emas. */
export function getArticleNeighbours(slug: NewsSlug): {
  previous: NewsArticle | null;
  next: NewsArticle | null;
} {
  const index = NEWS.findIndex((n) => n.slug === slug);
  return {
    previous: index > 0 ? (NEWS[index - 1] ?? null) : null,
    next: index >= 0 && index < NEWS.length - 1 ? (NEWS[index + 1] ?? null) : null,
  };
}

export function getExperts(): readonly Person[] {
  return EXPERTS;
}

export function getLeadership(): readonly Person[] {
  return LEADERSHIP;
}

export function getPartners(): readonly Partner[] {
  return PARTNERS;
}

/** Faqat tasdiqlangan hamkorlar; oltitadan kam boʻlsa bosh sahifada boʻlim chiqmaydi (15.2.6). */
export function getConfirmedPartners(): readonly Partner[] {
  return PARTNERS.filter((p) => p.status === "confirmed" && p.name && p.logo);
}

export function getContacts(): Contacts {
  return CONTACTS;
}

export function getArtworks(): readonly Artwork[] {
  return ARTWORKS.filter((a) => a.status === "confirmed" && a.consent.parent && a.consent.child);
}

export function getMilestones(): readonly Milestone[] {
  return MILESTONES;
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

export interface PendingItem {
  readonly area: string;
  readonly id: string;
  readonly status: ContentStatus;
  readonly note: string;
}

/** verify.mjs uchun: tasdiq kutayotgan yozuvlar roʻyxati (ogohlantirish, xato emas). */
export function listPendingContent(): readonly PendingItem[] {
  const out: PendingItem[] = [];
  for (const p of PROJECTS) {
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
  for (const n of NEWS) {
    if (n.status !== "confirmed")
      out.push({ area: "news", id: n.slug, status: n.status, note: "matn va sana" });
    if (n.cover.status !== "confirmed")
      out.push({ area: "news", id: `${n.slug}.cover`, status: n.cover.status, note: "muqova" });
  }
  for (const person of [...EXPERTS, ...LEADERSHIP]) {
    if (person.status !== "confirmed")
      out.push({ area: person.kind, id: person.id, status: person.status, note: "ism, surat" });
  }
  if (!PARTNERS.length)
    out.push({ area: "partners", id: "list", status: "pending", note: "roʻyxat" });
  for (const [k, v] of Object.entries(CONTACTS) as [keyof Contacts, Contacts[keyof Contacts]][]) {
    if (k === "socials") continue;
    if ((v as { status: ContentStatus }).status !== "confirmed")
      out.push({ area: "contacts", id: k, status: "pending", note: k });
  }
  for (const m of MILESTONES) {
    if (m.status !== "confirmed")
      out.push({ area: "history", id: m.id, status: m.status, note: "sana" });
  }
  if (!ARTWORKS.length)
    out.push({ area: "gallery", id: "artworks", status: "pending", note: "rozilik bilan ishlar" });
  return out;
}
