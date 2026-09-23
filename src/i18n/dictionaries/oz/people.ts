// Avtomatik: scripts/transliterate.mts uz/people.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { people as source } from "../uz/people";

export const people: typeof source = {
  experts: {
    title: "Экспертлар кенгаши",
    lead: "Кенгаш студиялар дастурини кўриб чиқади, кастинг ва кўргазмаларда ишларни баҳолайди.",
    field: "Соҳа",
    role: "Вазифа",
    bio: "Қисқача",
    open: "Батафсил",
    pending: "Кенгаш аъзоларининг исми ва сурати ташкилот тасдиғини кутмоқда",
  },
  leadership: {
    title: "Раҳбарият",
    lead: "Бирлашма раҳбарияти ва қабул тартиби.",
    position: "Лавозим",
    reception: "Қабул кунлари",
    receptionPending: "Қабул кунлари тасдиқ кутилмоқда",
    email: "Расмий почта",
    emailPending: "Почта манзили тасдиқ кутилмоқда",
    day: "Кун",
    hours: "Соат",
    pending: "Раҳбарнинг исми ва сурати ташкилот тасдиғини кутмоқда",
  },
  portraitAlt: "{name} портрети",
  placeholderAlt: "Равоқ шаклидаги бўш портрет ўрни",
  dialogLabel: "{name} ҳақида",
};
