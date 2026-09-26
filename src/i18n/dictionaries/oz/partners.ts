// Avtomatik: scripts/transliterate.mts uz/partners.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { partners as source } from "../uz/partners";

export const partners: typeof source = {
  title: "Ҳамкорлар",
  groups: {
    state: "Давлат идоралари",
    international: "Халқаро ташкилотлар",
    creative: "Ижодий ҳамкорлар",
    sponsors: "Ҳомийлар",
  },
  logoAlt: "{name} логотипи",
  visit: "{name} сайтига ўтиш",
  invite: "Ҳамкорлик таклифи учун ёзинг",
};
