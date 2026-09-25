// Avtomatik: scripts/transliterate.mts uz/partners.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { partners as source } from "../uz/partners";

export const partners: typeof source = {
  title: "Ҳамкорлар",
  lead: "Бирлашма билан бирга ишлайдиган ташкилотлар. Логотиплар ҳамкорнинг ўзи берган шаклда кўрсатилади.",
  groups: {
    state: "Давлат идоралари",
    international: "Халқаро ташкилотлар",
    creative: "Ижодий ҳамкорлар",
    sponsors: "Ҳомийлар",
  },
  pending: "Ҳамкорлар рўйхати ташкилот тасдиғини кутмоқда",
  logoAlt: "{name} логотипи",
  visit: "{name} сайтига ўтиш",
  invite: "Ҳамкорлик таклифи учун ёзинг",
};
