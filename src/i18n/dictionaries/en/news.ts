import type { news as source } from "../uz/news";

export const news: typeof source = {
  title: "News",
  backToList: "All news",
  previous: "Previous story",
  next: "Next story",
  photos: {
    label: "Photos",
    previous: "Previous photo",
    next: "Next photo",
    alt: "{title}: photo {n}",
  },
  related: "More news",
  empty: "No news yet.",
};
