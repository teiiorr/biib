import {
  getArticle,
  getContacts,
  getExperts,
  getLeadership,
  getMilestones,
  getNews,
  getPartners,
  getProjects,
  pageContentStatus,
} from "@/content";
import type { ContentStatus } from "@/content/types";
import type { NewsSlug, PageKey } from "@/i18n/routes";

/** Sahifadagi eng «xom» yozuv holati: noindex va sitemap sanalari shu orqali hal boʻladi (18.1). */
export function statusForPage(key: PageKey, slug?: NewsSlug): ContentStatus {
  switch (key) {
    case "home":
      return pageContentStatus([
        ...getProjects().map((p) => p.status),
        ...getNews().map((n) => n.status),
      ]);
    case "about":
      return pageContentStatus(getMilestones().map((m) => m.status));
    case "projects":
      return pageContentStatus(getProjects().map((p) => p.status));
    case "news":
      return pageContentStatus(getNews().map((n) => n.status));
    case "newsItem":
      return slug ? getArticle(slug).status : "draft";
    case "experts":
      return pageContentStatus(getExperts().map((p) => p.status));
    case "leadership":
      return pageContentStatus(getLeadership().map((p) => p.status));
    case "partners": {
      const partners = getPartners();
      return partners.length ? pageContentStatus(partners.map((p) => p.status)) : "pending";
    }
    case "contacts": {
      const c = getContacts();
      return pageContentStatus([c.address.status, c.phones.status, c.email.status, c.hours.status]);
    }
    case "privacy":
      return "draft";
  }
}
