import type { Partner } from "./types";

/**
 * HAMKORLAR — mijozdan keladigan maʼlumot.
 * Har bir band uçun kerak: haqiqiy nom (name), logotip fayli (logo) va sayt (href).
 * Logotip töldirilmasa, çizilgan örinbosar körsatiladi.
 * Brendlar hurmat qilinadi: logotip qayta böyalmaydi, faqat kulrangdan rangga ötadi.
 */
export const PARTNERS: readonly Partner[] = [
  { id: "partner-1", accent: "blue" },
  { id: "partner-2", accent: "sun" },
  { id: "partner-3", accent: "coral" },
  { id: "partner-4", accent: "grass" },
  { id: "partner-5", accent: "grape" },
  { id: "partner-6", accent: "pink" },
  { id: "partner-7", accent: "blue" },
  { id: "partner-8", accent: "sun" },
];
