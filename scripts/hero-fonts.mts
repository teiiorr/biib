/*
 * Qahramon sarlavhasi uchun har tilga alohida mayda toʻplam, faqat tashkilot nomidagi harflar bilan.
 * Fayl oldindan yuklanadi, shuning uchun birinchi kadrdayoq haqiqiy shrift chiqadi va siljish boʻlmaydi.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { getDictionary } from "../src/i18n/dictionaries";
import { LOCALES } from "../src/i18n/locales";

const SOURCE = path.resolve("src/assets/fonts/UnboundedUZ-700.ttf");
const OUT = path.resolve("public/fonts");
mkdirSync(OUT, { recursive: true });
/* fontTools va brotli oʻrnatilgan Python kerak; boshqasini PYTHON oʻzgaruvchisi orqali berish mumkin. */
const python = process.env.PYTHON ?? "python3";

const texts: Record<string, string> = {};
/* Nom text-transform bilan bosh harflarda chiqadi, shuning uchun toʻplamga ikkala shakl ham kiradi. */
for (const locale of LOCALES) {
  const name = getDictionary(locale).common.brand.name;
  texts[locale] = `${name} ${name.toUpperCase()}`;
}
const spec = path.resolve(".verify/hero-text.json");
mkdirSync(path.dirname(spec), { recursive: true });
writeFileSync(spec, JSON.stringify(texts));

const script = `
import json, sys
from fontTools.ttLib import TTFont
from fontTools import subset
source, out, spec = sys.argv[1:4]
texts = json.load(open(spec))
for locale, text in texts.items():
    font = TTFont(source)
    options = subset.Options(flavor="woff2", layout_features=["kern", "liga", "calt"], name_IDs=[1, 2, 4, 6], notdef_outline=True)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text + " \\u02bb\\u02bc")
    subsetter.subset(font)
    target = f"{out}/hero-{locale}.woff2"
    font.flavor = "woff2"
    font.save(target)
    import os
    print(f"hero-{locale}.woff2\\t{os.path.getsize(target)//1024} KB\\t{text}")
`;
execFileSync(python, ["-c", script, SOURCE, OUT, spec], { stdio: "inherit" });
