import type { errors as source } from "../uz/errors";

export const errors: typeof source = {
  notFound: {
    title: "Page not found",
    home: "Home",
    news: "News",
  },
  error: {
    title: "Something went wrong",
    retry: "Try again",
    home: "Home",
  },
  global: {
    title: "Page not found",
  },
};
