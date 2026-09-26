// Avtomatik: scripts/transliterate.mts uz/people.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { people as source } from "../uz/people";

export const people: typeof source = {
  experts: {
    title: "Ekspertlar kengaşi",
    open: "Batafsil",
  },
  leadership: {
    title: "Rahbariyat",
    reception: "Qabul kunlari",
    email: "Rasmiy poçta",
    day: "Kun",
    hours: "Soat",
  },
  dialogLabel: "{name} haqida",
};
