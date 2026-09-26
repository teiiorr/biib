// Avtomatik: scripts/transliterate.mts uz/people.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { people as source } from "../uz/people";

export const people: typeof source = {
  experts: {
    title: "Экспертлар кенгаши",
    open: "Батафсил",
  },
  leadership: {
    title: "Раҳбарият",
    reception: "Қабул кунлари",
    email: "Расмий почта",
    day: "Кун",
    hours: "Соат",
  },
  dialogLabel: "{name} ҳақида",
};
