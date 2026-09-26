import "server-only";
import { cache } from "react";

import type { PageKey } from "@/i18n/routes";
import { loadSnapshot } from "@/lib/cms/load";
import {
  selectArticle,
  selectArtworks,
  selectConfirmedPartners,
  selectContacts,
  selectExperts,
  selectFlagship,
  selectLeadership,
  selectMilestones,
  selectNeighbours,
  selectNews,
  selectPartners,
  selectProjects,
  selectRedirect,
  selectUpopGallery,
  statusForPage,
} from "./select";

export { t } from "./select";

/*
 * Sahifa va komponentlar kontentga faqat shu funksiyalar orqali kiradi: manba (repo yoki maʼlumotlar
 * bazasi) almashsa ular tegilmaydi. Hammasi serverda, bitta render ichida bir marta hisoblanadi.
 * Matnlar Localized: til tanlovi komponentda (t).
 */

export const getProjects = cache(async () => selectProjects(await loadSnapshot()));

/** Bosh loyiha yoʻq boʻlsa null: chaqiruvchi boʻlimni yashiradi yoki 404 beradi. */
export const getFlagship = cache(async () => selectFlagship(await loadSnapshot()));

export const getUpopGallery = cache(async () => selectUpopGallery(await loadSnapshot()));

export const getNews = cache(async () => selectNews(await loadSnapshot()));

/** Maqola topilmasa null: sahifa notFound() chaqiradi. */
export const getArticle = cache(async (slug: string) => selectArticle(await loadSnapshot(), slug));

/** Eski havola: maqola nomi oʻzgargan boʻlsa yangi slug (sahifa 308 bilan yoʻnaltiradi). */
export const getNewsRedirect = cache(async (slug: string) =>
  selectRedirect(await loadSnapshot(), slug),
);

export const getArticleNeighbours = cache(async (slug: string) =>
  selectNeighbours(await loadSnapshot(), slug),
);

export const getExperts = cache(async () => selectExperts(await loadSnapshot()));

export const getLeadership = cache(async () => selectLeadership(await loadSnapshot()));

export const getPartners = cache(async () => selectPartners(await loadSnapshot()));

export const getConfirmedPartners = cache(async () =>
  selectConfirmedPartners(await loadSnapshot()),
);

export const getContacts = cache(async () => selectContacts(await loadSnapshot()));

export const getArtworks = cache(async () => selectArtworks(await loadSnapshot()));

export const getMilestones = cache(async () => selectMilestones(await loadSnapshot()));

/** Yuklangan rasmlarning tayyor nusxalari (ContentPicture). */
export const getMedia = cache(async () => (await loadSnapshot()).media);

/** noindex va sitemap uchun sahifa holati (18.1). */
export const getPageStatus = cache(async (key: PageKey, slug?: string) =>
  statusForPage(await loadSnapshot(), key, slug),
);
