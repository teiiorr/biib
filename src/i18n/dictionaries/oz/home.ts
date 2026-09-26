// Avtomatik: scripts/transliterate.mts uz/home.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { home as source } from "../uz/home";

export const home: typeof source = {
  hero: {
    ctaProjects: "UPOP TREND",
    ctaAbout: "Биз ҳақимизда",
    videoAlt: "Бирлашма белгиси қоронғи саҳнада, атрофида олтин ва пушти ипак тўлқинлари",
  },
  portal: {
    statement: "Иқтидорли болаларни республиканинг барча ҳудудларидан, айниқса чекка туманлардан излаб топамиз ва маҳалладан республика саҳнасигача олиб чиқамиз.",
    label: "Дарвоза",
  },
  upop: {
    heading: "UPOP TREND",
    register: "upop.uz сайтида рўйхатдан ўтиш",
    open: "Лойиҳа ҳақида",
  },
  news: {
    heading: "Янгиликлар",
    all: "Барча янгиликлар",
  },
  people: {
    heading: "Раҳбарият ва экспертлар",
    leadership: "Раҳбарият",
    experts: "Экспертлар кенгаши",
  },
  partners: {
    heading: "Ҳамкорлар",
    all: "Барча ҳамкорлар",
  },
  contact: {
    heading: "Боғланиш",
    open: "Алоқа саҳифаси",
    telegram: "Телеграмда ёзиш",
  },
  gallery: {
    heading: "Болалар галереяси",
    caption: "{name}, {age} ёш, {region}",
  },
};
