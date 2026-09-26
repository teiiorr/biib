// Avtomatik: scripts/transliterate.mts uz/errors.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { errors as source } from "../uz/errors";

export const errors: typeof source = {
  notFound: {
    title: "Саҳифа топилмади",
    home: "Бош саҳифага",
    news: "Янгиликларга",
  },
  error: {
    title: "Нимадир нотўғри кетди",
    retry: "Қайта уриниш",
    home: "Бош саҳифага",
  },
  global: {
    title: "Саҳифа топилмади",
  },
};
