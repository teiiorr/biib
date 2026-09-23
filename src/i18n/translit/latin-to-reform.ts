import { KEEP_WORDS, REFORM_WORDS } from "../translit-exceptions";
import { mapWords, matchCase } from "./words";

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

function transliterateWord(word: string): string {
  const lower = word.toLowerCase();
  if (KEEP_WORDS.has(lower)) return word;
  const exception = REFORM_WORDS[lower];
  if (exception) return matchCase(word, exception);
  return RULES.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), word);
}

/** Joriy lotin → 2026 imlosi. Intl chiqishi (oy va kun nomlari) ham shu orqali oʻtadi. */
export function latinToReform(text: string): string {
  return mapWords(text, transliterateWord);
}
