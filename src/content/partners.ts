import type { Partner } from "./types";

/**
 * HAMKORLAR — mijozdan keladigan maʼlumot.
 * Har bir band uçun kerak: haqiqiy nom (name), logotip fayli (logo) va sayt (href).
 * Logotip töldirilmasa, çizilgan örinbosar körsatiladi.
 * Brendlar hurmat qilinadi: logotip qayta böyalmaydi, faqat kulrangdan rangga ötadi.
 */
export const PARTNERS: readonly Partner[] = [
  { id: "partner-1", accent: "violet" },
  { id: "partner-2", accent: "gold" },
  { id: "partner-3", accent: "magenta" },
  { id: "partner-4", accent: "turquoise" },
  { id: "partner-5", accent: "violet" },
  { id: "partner-6", accent: "magenta" },
  { id: "partner-7", accent: "violet" },
  { id: "partner-8", accent: "gold" },
];
