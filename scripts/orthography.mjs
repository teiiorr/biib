#!/usr/bin/env node
/**
 * Özbek imlosini tekşiradi — messages/*.json va src/content/*.ts böyiça.
 *
 *   uz-Latn           oʻ gʻ (U+02BB), tutuq belgisi ʼ (U+02BC); ö ğ ş ç bölmaydi
 *   uz-Latn-x-reform  ö ğ ş ç; oʻ gʻ sh ch qolmaydi
 *   barçasi           töğri tirnoq ' teskari tirnoq ` va akut ´ yöq
 */

import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const LOCALES = ["uz-Latn", "uz-Cyrl", "uz-Latn-x-reform", "ru", "en"];

/** Tekşiruvdan çetda: ataqli otlar, havolalar, poçta va ICU tokenlari. */
const EXEMPT = [
  /UPOP TREND/g,
  /Designed & Developed by teiior/g,
  /https?:\/\/\S+/g,
  /[\w.+-]+@[\w.-]+/g,
  /\{[a-zA-Z]+\}/g,
];

function strip(value) {
  return EXEMPT.reduce((text, pattern) => text.replace(pattern, " "), value);
}

const problems = [];

function check(value, locale, where) {
  const text = strip(value);

  // Töğri tirnoq, teskari tirnoq va akut hеç bir tilda töğri emas.
  if (/['`´]/.test(text)) {
    problems.push(`${where} [${locale}]: notöğri apostrof — ${JSON.stringify(value)}`);
  }

  // ‘ ’ ingliz tilida töğri (children’s), özbek va rus tilida emas.
  if (locale !== "en" && /[‘’]/.test(text)) {
    problems.push(`${where} [${locale}]: ‘ yoki ’ ötkazilmaydi — ${JSON.stringify(value)}`);
  }

  if (locale === "uz-Latn" && /[öğşç]/i.test(text)) {
    problems.push(`${where} [uz-Latn]: yangi alifbo harfi — ${JSON.stringify(value)}`);
  }

  if (locale === "uz-Latn-x-reform") {
    if (/oʻ|gʻ/i.test(text)) {
      problems.push(`${where} [reform]: oʻ/gʻ qolgan — ${JSON.stringify(value)}`);
    }
    if (/sh|ch/i.test(text)) {
      problems.push(`${where} [reform]: sh/ch qolgan — ${JSON.stringify(value)}`);
    }
  }
}

/** JSON daraxtidagi barça satrlarni aylanadi. */
function walk(node, locale, where) {
  if (typeof node === "string") return check(node, locale, where);
  if (Array.isArray(node)) return node.forEach((item, i) => walk(item, locale, `${where}[${i}]`));
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) walk(value, locale, `${where}.${key}`);
  }
}

let checked = 0;

for (const locale of LOCALES) {
  const file = `messages/${locale}.json`;
  const data = JSON.parse(await readFile(file, "utf8"));
  walk(data, locale, file);
  checked += 1;
}

/**
 * src/content/*.ts — bu yerda beş til bitta obyektda turadi, şuning uçun
 * kalitni topib, satr yoki massiv qiymatini yiğamiz.
 */
const KEY = new RegExp(`^\\s*"?(${LOCALES.join("|")})"?:\\s*(.*)$`);

for (const name of await readdir("src/content")) {
  if (!name.endsWith(".ts")) continue;
  const file = join("src/content", name);
  const lines = (await readFile(file, "utf8")).split("\n");
  checked += 1;

  for (let i = 0; i < lines.length; i += 1) {
    const match = KEY.exec(lines[i]);
    if (!match) continue;
    const [, locale, rest] = match;

    if (rest.startsWith("[")) {
      for (let j = i + 1; j < lines.length && !/^\s*\],?\s*$/.test(lines[j]); j += 1) {
        const item = /^\s*"((?:[^"\\]|\\.)*)"/.exec(lines[j]);
        if (item) check(JSON.parse(`"${item[1]}"`), locale, `${file}:${j + 1}`);
      }
      continue;
    }

    const single = /^"((?:[^"\\]|\\.)*)"/.exec(rest);
    if (single) check(JSON.parse(`"${single[1]}"`), locale, `${file}:${i + 1}`);
  }
}

if (problems.length) {
  console.error(`Imlo xatolari (${problems.length}):`);
  for (const line of problems) console.error("  " + line);
  process.exit(1);
}

console.log(`Imlo toza — ${checked} fayl tekshirildi.`);
