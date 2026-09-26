import type { news as source } from "../uz/news";

export const news: typeof source = {
  title: "Новости",
  backToList: "Все новости",
  previous: "Предыдущая новость",
  next: "Следующая новость",
  photos: {
    label: "Фотографии",
    previous: "Предыдущее фото",
    next: "Следующее фото",
    alt: "{title}: фото {n}",
  },
  related: "Другие новости",
  empty: "Новостей пока нет.",
};
