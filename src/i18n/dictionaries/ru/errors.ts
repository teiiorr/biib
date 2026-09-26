import type { errors as source } from "../uz/errors";

export const errors: typeof source = {
  notFound: {
    title: "Страница не найдена",
    home: "На главную",
    news: "К новостям",
  },
  error: {
    title: "Что-то пошло не так",
    retry: "Попробовать снова",
    home: "На главную",
  },
  global: {
    title: "Страница не найдена",
  },
};
