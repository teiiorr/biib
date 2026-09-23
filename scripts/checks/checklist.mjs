import { CLICHES } from "./anti-slop.mjs";
import { pass, writeText } from "./util.mjs";

const ITEMS_X = [
  "Uchta bir xil «ikonka tepada» kartalar yoʻq; har roʻyxat turi oʻz maketiga ega (chor-bogʻ, tahririy toʻr, ravoq portretlar, logotip maydoni).",
  "1-2-3 raqamli qadam qatorlari yoʻq.",
  "Katta raqamli statistika plitkalari yoʻq.",
  "Rangli chap hoshiyali kartalar va karta ichida karta yoʻq.",
  "Har sarlavha tepasida eyebrow/kicker yorligʻi yoʻq.",
  "Karta ichidagi media faqat 4:5, 3:2, 16:9, 1:1 va ravoq 3:4, 4:5 nisbatlarida.",
  "Karta matni chapga tekis, bir qatordagi kartalarda bir xil bazaviy chiziq; chetdan 16 px (mobil) / 24 px (desktop) kam emas.",
];
const ITEMS_XIV = [
  "Gradient matn yoʻq; backdrop-filter faqat glass modulida.",
  "Emoji yoʻq (JSX, matn, alt).",
  "Kapsula (pill) badge/teg yoʻq; «Trusted by» logotip devori yoʻq; oʻylab topilgan odamlar bilan testimonial karusel yoʻq.",
  'Lorem, «Coming soon», oʻlik havola, href="#" yoʻq (pending kontent uchun dizayn qilingan oʻrinbosar bundan mustasno).',
  "Tashkilot, odamlar va hamkorlar haqida oʻylab topilgan faktlar yoʻq.",
  "Qahramon boʻlimida serif kursiv urgʻu soʻzi yoʻq; bir ekranda bitta maqsadga ikki CTA yoʻq (Art. XV).",
];

/** G9 uchun inson koʻrigi roʻyxati: greplar tutolmaydigan bandlar. */
export function writeChecklist(mode) {
  const lines = [
    "# Anti-slop koʻrik roʻyxati · docs/qa/anti-slop-checklist.md",
    "",
    `Yangilangan: ${new Date().toISOString()} (${mode}). Avtomatik greplar G0/G9 da; quyidagilar inson koʻrigi uchun.`,
    "",
    "## §8 Art. X · Kartalar va kontent bloklari",
    ...ITEMS_X.map((item) => `- [ ] ${item}`),
    "",
    "## §8 Art. XIV · Taqiqlar",
    ...ITEMS_XIV.map((item) => `- [ ] ${item}`),
    "",
    "## Klishelar (grep bilan tekshiriladi)",
    "| Til | Ibora |",
    "|---|---|",
    ...CLICHES.map(([lang, label]) => `| ${lang} | ${label} |`),
    "",
  ];
  writeText("docs/qa/anti-slop-checklist.md", lines.join("\n"));
  return pass("anti-slop:checklist", "docs/qa/anti-slop-checklist.md yozildi");
}
