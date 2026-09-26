import type { Locale } from "./locales";

/* Brauzerlarda oʻzbekcha boʻgʻin koʻchirish lugʻati yoʻq: ikki chetga tekis matnda soʻzlar orasi katta
   boʻlib ketardi. Boʻgʻin chegaralariga yumshoq tire (U+00AD) qoʻyiladi — koʻrinmaydi, faqat qator
   oxirida kerak boʻlsa tire boʻlib chiqadi. Imlo qoidasi: har boʻgʻinda bitta unli; ikki unli orasidagi
   bitta undosh keyingi boʻgʻinga, bir nechta undoshdan faqat oxirgisi keyingi boʻgʻinga oʻtadi; ng, sh,
   ch, oʻ, gʻ boʻlinmaydi; soʻz boshida va oxirida bitta harf yolgʻiz qolmaydi. */

const SOFT_HYPHEN = "­";
const TURNED_COMMA = "ʻ";
const APOSTROPHE = "ʼ";

interface Script {
  readonly vowels: ReadonlySet<string>;
  /** Bitta tovush beradigan harf birikmalari (kichik harfda). */
  readonly units: readonly string[];
  /** Oldingi harfga qoʻshiladigan belgilar (ʼ, ъ, ь): ulardan oldin boʻlinmaydi. */
  readonly attach: ReadonlySet<string>;
}

const LATIN: Script = {
  vowels: new Set(["a", "e", "i", "o", "u", `o${TURNED_COMMA}`]),
  units: [`o${TURNED_COMMA}`, `g${TURNED_COMMA}`, "sh", "ch", "ng"],
  attach: new Set([APOSTROPHE]),
};

const CYRILLIC: Script = {
  vowels: new Set(["а", "е", "ё", "и", "о", "у", "ў", "э", "ю", "я"]),
  units: ["нг"],
  attach: new Set(["ъ", "ь", APOSTROPHE]),
};

const REFORM: Script = {
  vowels: new Set(["a", "e", "i", "o", "u", "ö"]),
  units: ["ng"],
  attach: new Set([APOSTROPHE]),
};

const SCRIPTS: Partial<Record<Locale, Script>> = { uz: LATIN, oz: CYRILLIC, ozbekca: REFORM };

/* Soʻz harf birliklariga boʻlinadi: birikmalar va qoʻshiladigan belgilar bitta birlik. */
function units(word: string, script: Script): string[] {
  const lower = word.toLowerCase();
  const out: string[] = [];
  let i = 0;
  while (i < word.length) {
    const unit = script.units.find((u) => lower.startsWith(u, i));
    const size = unit ? unit.length : 1;
    const piece = word.slice(i, i + size);
    const last = out.length - 1;
    if (script.attach.has(piece) && last >= 0) out[last] += piece;
    else out.push(piece);
    i += size;
  }
  return out;
}

function hyphenateWord(word: string, script: Script): string {
  const parts = units(word, script);
  const isVowel = (unit: string): boolean =>
    script.vowels.has([...unit.toLowerCase()].filter((c) => !script.attach.has(c)).join(""));
  const vowelAt: number[] = [];
  parts.forEach((unit, index) => {
    if (isVowel(unit)) vowelAt.push(index);
  });
  if (vowelAt.length < 2) return word;
  const breaks = new Set<number>();
  for (let k = 0; k + 1 < vowelAt.length; k += 1) {
    const from = vowelAt[k] ?? 0;
    const to = vowelAt[k + 1] ?? 0;
    const consonants = to - from - 1;
    /* Oraliq undoshlardan faqat oxirgisi keyingi boʻgʻinga (unli-unli: oʻrtadan). Tutuq belgisi, ъ va ь
       oldingi boʻgʻinda qoladi: «sanʼ-at», «санъ-ат». */
    const moved = parts[to - 1] ?? "";
    const closes = [...script.attach].some((mark) => moved.endsWith(mark));
    breaks.add(consonants <= 0 || closes ? to : to - 1);
  }
  const letters = (from: number, to: number): number =>
    parts.slice(from, to).reduce((sum, unit) => sum + unit.length, 0);
  let out = "";
  parts.forEach((unit, index) => {
    const keep = letters(0, index) >= 2 && letters(index, parts.length) >= 2;
    if (breaks.has(index) && keep) out += SOFT_HYPHEN;
    out += unit;
  });
  return out;
}

/**
 * Oʻzbekcha matnga (lotin, kirill, 2026 imlosi) yumshoq tirelar qoʻyadi; rus va ingliz matni oʻzgarmaydi
 * (ular uchun brauzerning hyphens: auto lugʻati bor). Raqamli va boshqa yozuvdagi soʻzlar tegilmaydi.
 */
export function hyphenate(text: string, locale: Locale): string {
  const script = SCRIPTS[locale];
  if (!script) return text;
  return text.replace(/[\p{L}ʻʼ]+/gu, (word) =>
    word.length >= 6 ? hyphenateWord(word, script) : word,
  );
}
