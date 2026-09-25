// Avtomatik: scripts/transliterate.mts uz/partners.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { partners as source } from "../uz/partners";

export const partners: typeof source = {
  title: "Hamkorlar",
  lead: "Birlaşma bilan birga işlaydigan taşkilotlar. Logotiplar hamkorning özi bergan şaklda körsatiladi.",
  groups: {
    state: "Davlat idoralari",
    international: "Xalqaro taşkilotlar",
    creative: "Ijodiy hamkorlar",
    sponsors: "Homiylar",
  },
  pending: "Hamkorlar röyxati taşkilot tasdiğini kutmoqda",
  logoAlt: "{name} logotipi",
  visit: "{name} saytiga ötiş",
  invite: "Hamkorlik taklifi uçun yozing",
};
