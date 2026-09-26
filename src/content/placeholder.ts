/**
 * Egasining talabi (2026-09-26): tasdiq kutilayotgan boʻsh joylar lorem ipsum bilan toʻldiriladi, sayt
 * toʻla va jiddiy koʻrinsin. Bu oʻylab topilgan fakt emas — koʻrinib turgan oʻrinbosar matn: odam, hamkor
 * yoki manzil tasdiqlanganda content/ dagi yozuv toʻldiriladi va shu matn oʻz-oʻzidan yoʻqoladi.
 * Telefon va pochta havolaga aylanmaydi (soxta raqamga qoʻngʻiroq qilinmasin). Tekshiruvlar lorem ni
 * faqat shu faylda qabul qiladi.
 */
const NAMES = [
  "Lorem Ipsum",
  "Dolor Sitamet",
  "Consectetur Adipis",
  "Elit Seddo",
  "Tempor Incidunt",
  "Labore Magna",
  "Aliqua Veniam",
  "Nostrud Ullamco",
] as const;

export const FILLER = {
  word: "Lorem ipsum",
  line: "Lorem ipsum dolor sit amet",
  sentence: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
} as const;

export function fillerName(index: number): string {
  return NAMES[index % NAMES.length] ?? FILLER.word;
}
