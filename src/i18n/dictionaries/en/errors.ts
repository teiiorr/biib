import type { errors as source } from "../uz/errors";

export const errors: typeof source = {
  notFound: {
    title: "Page not found",
    text: "There is no page at this address, or it has moved.",
    home: "Home",
    news: "News",
  },
  error: {
    title: "Something went wrong",
    text: "Try reloading the page. If it happens again, write to us.",
    retry: "Try again",
    home: "Home",
  },
  global: {
    title: "Page not found",
    text: "There is no page at this address. Choose a language:",
  },
};
