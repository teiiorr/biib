import { CYRILLIC_WORDS, KEEP_WORDS } from "../translit-exceptions";
import { mapWords, matchCase } from "./words";

const VOWELS = new Set(["a", "e", "i", "o", "u", "ʻ"]);

const SINGLE: Readonly<Record<string, string>> = {
  a: "а",
  b: "б",
  c: "ц",
  d: "д",
  e: "е",
  f: "ф",
  g: "г",
  h: "ҳ",
  i: "и",
  j: "ж",
  k: "к",
  l: "л",
  m: "м",
  n: "н",
  o: "о",
  p: "п",
  q: "қ",
  r: "р",
  s: "с",
  t: "т",
  u: "у",
  v: "в",
  x: "х",
  y: "й",
  z: "з",
  ʼ: "ъ",
};

function upperFirst(text: string, upper: boolean): string {
  return upper ? text.toUpperCase() : text;
}

function transliterateWord(word: string): string {
  const lower = word.toLowerCase();
  if (KEEP_WORDS.has(lower)) return word;
  const exception = CYRILLIC_WORDS[lower];
  if (exception) return matchCase(word, exception);

  let out = "";
  let i = 0;
  while (i < lower.length) {
    const ch = lower[i] ?? "";
    const next = lower[i + 1] ?? "";
    const next2 = lower[i + 2] ?? "";
    const upper = word[i] !== lower[i];
    const prev = i === 0 ? "" : (lower[i - 1] ?? "");
    const atStart = i === 0 || prev === "-";

    if (ch === "o" && next === "ʻ") {
      out += upperFirst("ў", upper);
      i += 2;
      continue;
    }
    if (ch === "g" && next === "ʻ") {
      out += upperFirst("ғ", upper);
      i += 2;
      continue;
    }
    // Isʼhoq: tutuq belgisi faqat «sh» digrafini buzish uchun turadi, kirillda u yoʻqoladi.
    if (ch === "s" && next === "ʼ" && next2 === "h") {
      out += upperFirst("с", upper);
      i += 2;
      continue;
    }
    if (ch === "s" && next === "h") {
      out += upperFirst("ш", upper);
      i += 2;
      continue;
    }
    if (ch === "c" && next === "h") {
      out += upperFirst("ч", upper);
      i += 2;
      continue;
    }
    if (ch === "y" && next === "o" && next2 === "ʻ") {
      out += upperFirst("й", upper) + "ў";
      i += 3;
      continue;
    }
    if (ch === "y" && (next === "o" || next === "u" || next === "a" || next === "e")) {
      const map: Record<string, string> = { o: "ё", u: "ю", a: "я", e: "е" };
      out += upperFirst(map[next] ?? "", upper);
      i += 2;
      continue;
    }
    // Soʻz boshida va unlidan keyin «e» → «э»: eng, ekspert, poema.
    if (ch === "e" && (atStart || VOWELS.has(prev))) {
      out += upperFirst("э", upper);
      i += 1;
      continue;
    }
    if (ch === "ʼ" && (atStart || i === lower.length - 1)) {
      i += 1;
      continue;
    }
    const mapped = SINGLE[ch];
    out += mapped ? upperFirst(mapped, upper) : (word[i] ?? "");
    i += 1;
  }
  return out;
}

export function latinToCyrillic(text: string): string {
  return mapWords(text, transliterateWord);
}
