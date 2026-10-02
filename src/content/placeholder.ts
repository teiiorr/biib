/**
 * Tasdiq kutilayotgan boʻsh joylar lorem ipsum bilan toʻldiriladi: bu fakt emas, koʻrinib turgan
 * oʻrinbosar matn. Yozuv tasdiqlanganda u oʻz-oʻzidan yoʻqoladi. Telefon va pochta havolaga
 * aylanmaydi: soxta raqamga qoʻngʻiroq qilinmasin. Tekshiruvlar lorem matnini faqat shu faylda qabul qiladi.
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
