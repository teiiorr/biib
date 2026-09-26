// Avtomatik: scripts/transliterate.mts uz/errors.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { errors as source } from "../uz/errors";

export const errors: typeof source = {
  notFound: {
    title: "Sahifa topilmadi",
    home: "Boş sahifaga",
    news: "Yangiliklarga",
  },
  error: {
    title: "Nimadir notöğri ketdi",
    retry: "Qayta uriniş",
    home: "Boş sahifaga",
  },
  global: {
    title: "Sahifa topilmadi",
  },
};
