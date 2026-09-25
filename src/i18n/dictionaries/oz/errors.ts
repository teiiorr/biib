// Avtomatik: scripts/transliterate.mts uz/errors.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { errors as source } from "../uz/errors";

export const errors: typeof source = {
  notFound: {
    title: "Саҳифа топилмади",
    text: "Бу манзилда саҳифа йўқ ёки у кўчирилган.",
    home: "Бош саҳифага",
    news: "Янгиликларга",
  },
  error: {
    title: "Нимадир нотўғри кетди",
    text: "Саҳифани қайта юклаб кўринг. Муаммо такрорланса, биз билан боғланинг.",
    retry: "Қайта уриниш",
    home: "Бош саҳифага",
  },
  global: {
    title: "Саҳифа топилмади",
    text: "Бу манзилда саҳифа йўқ. Тилни танланг:",
  },
};
