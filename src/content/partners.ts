import type { Partner } from "./types";

/**
 * Hamkorlar egasidan (2026-09-26). Sayt manzili hali berilmagan: havola qoʻyilmaydi (oʻylab topilmaydi).
 */
export const PARTNERS: readonly Partner[] = [
  {
    id: "uzbekgidroenergo",
    status: "confirmed",
    group: "state",
    name: {
      uz: "Oʻzbekgidroenergo",
      oz: "Ўзбекгидроэнерго",
      ozbekca: "Özbekgidroenergo",
      ru: "Узбекгидроэнерго",
      en: "Uzbekhydroenergo",
    },
    logo: "/brand/partner-uzbekgidroenergo.png",
    href: null,
  },
];
