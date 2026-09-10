import type { Localized } from "./types";

/**
 * Taşkilotning tarjima qilinadigan matnlari. Raqam va poçta org.ts da.
 */
export const ORG_TEXT: {
  readonly address: Localized;
  readonly hours: Localized;
  readonly mapLabel: Localized;
} = {
  address: {
    "uz-Latn": "Toshkent shahri, Yunusobod tumani, Amir Temur shoh koʻchasi, 1",
    "uz-Cyrl": "Тошкент шаҳри, Юнусобод тумани, Амир Темур шоҳ кўчаси, 1",
    "uz-Latn-x-reform": "Toşkent şahri, Yunusobod tumani, Amir Temur şoh köçasi, 1",
    ru: "Ташкент, Юнусабадский район, проспект Амира Темура, 1",
    en: "1 Amir Temur Avenue, Yunusobod district, Tashkent",
  },
  hours: {
    "uz-Latn": "Dushanba–juma, 09:00–18:00",
    "uz-Cyrl": "Душанба–жума, 09:00–18:00",
    "uz-Latn-x-reform": "Duşanba–juma, 09:00–18:00",
    ru: "Понедельник – пятница, 09:00–18:00",
    en: "Monday to Friday, 09:00–18:00",
  },
  mapLabel: {
    "uz-Latn": "Xaritada koʻrish",
    "uz-Cyrl": "Харитада кўриш",
    "uz-Latn-x-reform": "Xaritada köriş",
    ru: "Посмотреть на карте",
    en: "View on the map",
  },
};
