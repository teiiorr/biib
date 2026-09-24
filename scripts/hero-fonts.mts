/*
 * Qahramon sarlavhasi uchun mayda Akt toʻplami (til boʻyicha): faqat tashkilot nomidagi harflar,
 * wght 700 qotirilgan. cv05 (serifli I) saqlanadi, aks holda «Ijodkorligi Ijodiy» dagi I va l bir xil
 * koʻrinadi. Preload bilan birinchi kadrda haqiqiy shrift chiqadi, zaxira shrift almashinuvi va
 * siljish boʻlmaydi. fontTools va brotli kerak (PYTHON muhit oʻzgaruvchisi).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { getDictionary } from "../src/i18n/dictionaries";
import { LOCALES } from "../src/i18n/locales";

const SOURCE = path.resolve("src/assets/fonts/Akt[wght].ttf");
const OUT = path.resolve("public/fonts");
mkdirSync(OUT, { recursive: true });
/* fontTools va brotli oʻrnatilgan Python: PYTHON muhit oʻzgaruvchisi, sukutda python3. */
const python = process.env.PYTHON ?? "python3";

const texts: Record<string, string> = {};
for (const locale of LOCALES) texts[locale] = getDictionary(locale).common.brand.name;
const spec = path.resolve(".verify/hero-text.json");
mkdirSync(path.dirname(spec), { recursive: true });
writeFileSync(spec, JSON.stringify(texts));

const script = `
import json, sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
source, out, spec = sys.argv[1:4]
texts = json.load(open(spec))
for locale, text in texts.items():
    font = TTFont(source)
    font = instancer.instantiateVariableFont(font, {"wght": 700})
    options = subset.Options(flavor="woff2", layout_features=["kern", "liga", "calt", "cv05"], name_IDs=[1, 2, 4, 6], notdef_outline=True)
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
