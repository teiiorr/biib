import type { Locale } from "@/i18n/locales";

/* Xatboshi chegarasi boʻlgan boʻsh qator saqlanadi, faqat qator ichidagi ortiqcha boʻshliq olinadi. */
function tidy(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t ]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\.{3}/g, "…")
    .trim();
}

/* Toʻgʻri qoʻshtirnoq juftligi va inglizcha “…” oʻzbek va rus matnida «…» boʻladi. */
function guillemets(text: string): string {
  return text.replace(/"([^"\n]*)"/g, "«$1»").replace(/“([^”\n]*)”/g, "«$1»");
}

/**
 * Joriy lotin imlosi: o va g dan keyingi har qanday apostrof ʻ (U+02BB) boʻladi,
 * boshqa harflar orasidagisi tutuq belgisi ʼ (U+02BC).
 */
export function normalizeUz(text: string): string {
  const letters = text
    .replace(/([oOgG])['‘’`ʼ]/g, "$1ʻ")
    .replace(/(\p{L})['‘’`ʻ](?=\p{L})/gu, (match, letter: string) =>
      /[oOgG]/.test(letter) ? match : `${letter}ʼ`,
    );
  return tidy(guillemets(letters));
}

/** 2026 imlosi: oʻ → ö, gʻ → ğ (qoʻlda apostrof bilan yozilgan boʻlsa ham), tutuq belgisi oʻzgarmaydi. */
export function normalizeReform(text: string): string {
  const letters = text
    .replace(/o['‘’`ʻʼ]/g, "ö")
    .replace(/O['‘’`ʻʼ]/g, "Ö")
    .replace(/g['‘’`ʻʼ]/g, "ğ")
    .replace(/G['‘’`ʻʼ]/g, "Ğ")
    .replace(/(\p{L})['‘’`ʻ](?=\p{L})/gu, "$1ʼ");
  return tidy(guillemets(letters));
}

/** Kirill matnlari (oʻzbek va rus): qoʻshtirnoq «…», uch nuqta …. */
function normalizeCyrillic(text: string): string {
  return tidy(guillemets(text));
}

/** Inglizcha matn: “…” va soʻz ichida ’. */
function normalizeEn(text: string): string {
  return tidy(text.replace(/"([^"\n]*)"/g, "“$1”").replace(/(\p{L})'(?=\p{L})/gu, "$1’"));
}

export function normalizeFor(locale: Locale, text: string): string {
  switch (locale) {
    case "uz":
      return normalizeUz(text);
    case "ozbekca":
      return normalizeReform(text);
    case "oz":
    case "ru":
      return normalizeCyrillic(text);
    case "en":
      return normalizeEn(text);
  }
}
