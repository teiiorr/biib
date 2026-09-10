/**
 * Yangi lotin imlosi.
 *
 * CLDR da uz-Latn-x-reform yöq, şuning uçun Intl eski imloda qaytaradi:
 * "dushanba", "chorshanba". Quyidagi almaştiriş faqat Intl çiqişiga —
 * hafta kunlari va oy nomlariga — qöllanadi, sayt matnlariga emas:
 * ular qölda yozilgan alohida lugatda turadi.
 */

const RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/Oʻ/g, "Ö"],
  [/oʻ/g, "ö"],
  [/Gʻ/g, "Ğ"],
  [/gʻ/g, "ğ"],
  [/SH/g, "Ş"],
  [/Sh/g, "Ş"],
  [/sh/g, "ş"],
  [/CH/g, "Ç"],
  [/Ch/g, "Ç"],
  [/ch/g, "ç"],
];

export function reformOrthography(value: string): string {
  return RULES.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}
