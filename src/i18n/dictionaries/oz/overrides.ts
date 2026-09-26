import type { DeepPartial, Dictionary } from "../types";

/** Transliteratordan keyingi qoʻlda tuzatishlar (proofreading). Kalit yoʻli uz/ bilan bir xil. */
export const overrides: DeepPartial<Dictionary> = {
  /* Kirill matnda oʻlchov birligi ham kirillcha. */
  about: { mission: { charterHint: "PDF, 1\u00a0МБ" } },
};
