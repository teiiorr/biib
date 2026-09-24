// Avtomatik: scripts/transliterate.mts uz/people.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { people as source } from "../uz/people";

export const people: typeof source = {
  experts: {
    title: "Ekspertlar kengaşi",
    lead: "Kengaş studiyalar dasturini körib çiqadi, kasting va körgazmalarda işlarni baholaydi.",
    field: "Soha",
    role: "Vazifa",
    bio: "Qisqaça",
    open: "Batafsil",
    pending: "Kengaş aʼzolarining ismi va surati taşkilot tasdiğini kutmoqda",
  },
  leadership: {
    title: "Rahbariyat",
    lead: "Birlaşma rahbariyati va qabul tartibi.",
    position: "Lavozim",
    reception: "Qabul kunlari",
    receptionPending: "Qabul kunlari tasdiq kutilmoqda",
    email: "Rasmiy poçta",
    emailPending: "Poçta manzili tasdiq kutilmoqda",
    day: "Kun",
    hours: "Soat",
    pending: "Rahbarning ismi va surati taşkilot tasdiğini kutmoqda",
  },
  portraitAlt: "{name} portreti",
  placeholderAlt: "Böş portret ramkasi: surat taşkilot tasdiğini kutmoqda",
  dialogLabel: "{name} haqida",
};
