import type { Formats } from "next-intl";

export const formats = {
  dateTime: {
    numeric: { day: "2-digit", month: "2-digit", year: "numeric" },
    short: { day: "numeric", month: "short", year: "numeric" },
    long: { day: "numeric", month: "long", year: "numeric" },
    dayMonth: { day: "numeric", month: "long" },
  },
} satisfies Formats;
