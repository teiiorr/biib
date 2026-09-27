import { ORG_COPY } from "../copy-org";

const S = ORG_COPY.journal;
const ORDERS: Readonly<Record<string, string>> = S.orders;

/**
 * Jurnaldagi qisqacha nom: sarlavhasi yoʻq yakka yozuvlar (aloqa, tarmoqlar, galereya) va tartib
 * yozuvlari uchun. Boshqa obyekt boʻlsa null.
 */
export function orgSummary(entity: string, key: string): string | null {
  switch (entity) {
    case "contacts":
      return S.contacts;
    case "socials":
      return S.socials;
    case "upop_shots":
      return S.gallery;
    case "order": {
      const name = ORDERS[key.replace(/^people:/, "")];
      return name ? `${S.order}: ${name}` : S.order;
    }
    default:
      return null;
  }
}
