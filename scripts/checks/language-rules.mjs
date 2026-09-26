/* §7.1 imlo qonuni va til sizishi uchun qoidalar. */
export const UZBEK = new Set(["uz", "oz", "ozbekca"]);
export const NON_ENGLISH = new Set(["uz", "oz", "ozbekca", "ru"]);
export const NATIVE_NAMES = new Set(["Özbekça", "Ўзбекча", "English", "Русский", "Oʻzbekcha"]);
export const LATIN_ALLOW = new Set(
  "upop trend teiior youtube facebook instagram telegram google higgsfield vercel pdf svg png mp4 webm avif url id api bot ok uz ru en".split(
    " ",
  ),
);
/* Qisqa va oʻzbekchada ham uchraydigan soʻzlar (men, it, is, or, top, in, on, to, at) ataylab yoʻq. */
export const ENGLISH_WORDS = new Set(
  "the and for with from your you our we are this that these about more learn read view all open close back next previous share copy save send search menu home news contact contacts project projects page click here welcome discover explore join get started sign login submit cancel loading error found please thank thanks free new best team event events gallery photo children child creative creativity association theatre studio stage light dark system sound reset settings language design theme privacy policy partners leadership council experts watch play pause download by of".split(
    " ",
  ),
);
export const REFORM_LETTERS = /[ÖöĞğŞşÇç]/;
export const ROMANIAN_LETTERS = /[ȘșȚț]/;
export const LOREM = /\blorem\b/i;

/** Tekshiruvga aloqasi yoʻq boʻlaklar: oʻrinbosarlar, havolalar, pochta. */
/* Futer imzosi barcha tillarda aynan shu koʻrinishda (D18). */
const CREDIT = /Designed & Developed by teiior/g;
/* Belgi yonidagi yozuv hamma tilda aynan shu lotin bosh harflarda (egasining talabi); faqat shu satr. */
const WORDMARK = /BOLALAR IJODKORLIGI\s+IJODIY BIRLASHMASI|BOLALAR IJODKORLIGI|IJODIY BIRLASHMASI/g;

export function stripNonWords(value) {
  return value
    .replace(CREDIT, " ")
    .replace(WORDMARK, " ")
    .replace(/\{\{?\w+\}?\}/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\S+@\S+\.\S+/g, " ")
    .replace(/\b[\w-]+\.(?:uz|com|org|net|ru|io)\b/gi, " ")
    .replace(/@\w+/g, " ");
}

export function latinTokens(value) {
  return [
    ...stripNonWords(value).matchAll(
      /[A-Za-z\u00C0-\u024F][A-Za-z\u00C0-\u024F\u02BB\u02BC'’-]*/gu,
    ),
  ].map((m) => m[0]);
}

const isAcronym = (token) => /^[A-Z]{1,5}$/.test(token);
const normalize = (token) => token.replace(/^['’-]+|['’-]+$/g, "").toLowerCase();

export function englishLeaks(value, keep) {
  return latinTokens(value).filter((token) => {
    if (NATIVE_NAMES.has(token) || isAcronym(token)) return false;
    const word = normalize(token);
    return ENGLISH_WORDS.has(word) && !keep.has(word) && !LATIN_ALLOW.has(word);
  });
}

export function latinInCyrillic(value, keep) {
  return latinTokens(value).filter((token) => {
    if (NATIVE_NAMES.has(token) || isAcronym(token)) return false;
    const word = normalize(token);
    if (word.replace(/[^a-z]/g, "").length < 2) return false;
    return !keep.has(word) && !LATIN_ALLOW.has(word);
  });
}

export function apostropheIssues(locale, value) {
  const issues = [];
  if (locale === "oz") {
    if (/[\u02BB\u02BC]/.test(value)) issues.push("kirillda ʻ/ʼ oʻrniga ъ boʻlishi kerak");
    return issues;
  }
  if (/\p{L}[\u0027\u2018\u2019\u0060]\p{L}/u.test(value))
    issues.push(
      "soʻz ichida notoʻgʻri apostrof (U+0027/2018/2019/0060): oʻ gʻ uchun ʻ U+02BB, tutuq uchun ʼ U+02BC",
    );
  if (/[\u0027\u0060]/.test(value))
    issues.push("toʻgʻri qoʻshtirnoq yoki backtick: «…» yoki „…“ ishlating");
  if (locale === "ozbekca") {
    if (/\u02BB/.test(value)) issues.push("2026 imlosida ʻ boʻlmaydi (oʻ→ö, gʻ→ğ)");
  } else {
    if (/(?:^|[^oOgG])\u02BB/.test(value)) issues.push("ʻ faqat o/g dan keyin keladi");
    if (/[oOgG]\u02BC\p{L}/u.test(value)) issues.push("o/g dan keyin ʼ emas, ʻ (U+02BB) kerak");
  }
  return issues;
}

export function quoteIssues(locale, value) {
  const issues = [];
  if (/"/.test(value)) issues.push("toʻgʻri qoʻshtirnoq (U+0022) taqiqlangan");
  if (locale === "en") {
    if (/[«»„]/.test(value)) issues.push("inglizchada «» va „ emas, “…” ishlatiladi");
    return issues;
  }
  if (/\u201D/.test(value))
    issues.push("” (U+201D) oʻzbek/rus matnida ishlatilmaydi: «…» yoki „…“");
  const open = value.indexOf("\u201C");
  if (open >= 0 && value.lastIndexOf("\u201E", open) < 0)
    issues.push("“ faqat „…“ ichki qoʻshtirnoq sifatida keladi");
  return issues;
}
