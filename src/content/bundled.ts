import { CONTACTS } from "./contacts";
import { EXPERTS } from "./experts";
import { ARTWORKS } from "./gallery";
import { LEADERSHIP } from "./leadership";
import { MILESTONES } from "./milestones";
import { NEWS } from "./news";
import { PARTNERS } from "./partners";
import { PROJECTS } from "./projects";
import { SNAPSHOT_VERSION, type ContentSnapshot } from "./snapshot";
import { UPOP_GALLERY } from "./upop-gallery";

/* Modullar oʻzgarmaydi: nusxa bir marta yigʻiladi va har chaqiruvda shu obyekt qaytadi. */
const BUNDLED: ContentSnapshot = {
  version: SNAPSHOT_VERSION,
  projects: PROJECTS,
  news: NEWS,
  leadership: LEADERSHIP,
  experts: EXPERTS,
  partners: PARTNERS,
  contacts: CONTACTS,
  milestones: MILESTONES,
  upopGallery: UPOP_GALLERY,
  artworks: ARTWORKS,
  media: {},
  redirects: {},
  texts: {},
  allowWords: [],
};

/**
 * Repodagi kontent nusxasi: saytning zaxira manbai, tekshiruvlar (verify, testlar) ham faqat shuni
 * oʻqiydi. Sof modul: server-only emas, tsx va Playwright ichida ham ishlaydi.
 */
export function bundledSnapshot(): ContentSnapshot {
  return BUNDLED;
}
