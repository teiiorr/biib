/*
 * Manrope UZ va Unbounded UZ manba fayllari fontTools bilan Google unicode-range toʻplamlariga boʻlinadi.
 * Manba sifatida CDN shriftlari emas, oʻzbek belgilari qoʻshilgan nusxalar olinadi.
 * Qahramon sarlavhasi toʻplami alohida, hero-fonts.mts skriptida yasaladi.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.resolve("public/fonts");
mkdirSync(OUT, { recursive: true });
/* fontTools va brotli oʻrnatilgan Python kerak; boshqasini PYTHON oʻzgaruvchisi orqali berish mumkin. */
const python = process.env.PYTHON ?? "python3";

/* Diapazonlar Google Fonts bilan bir xil: brauzer faqat sahifadagi yozuvga kerakli faylni yuklaydi. */
const SUBSETS: Record<string, string> = {
  latin:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  "latin-ext":
    "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
  cyrillic: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
  "cyrillic-ext": "U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
};

interface Family {
  readonly name: string;
  readonly file: string;
  readonly source: string;
  readonly axes: Record<string, string>;
  readonly weight: string;
  readonly fallback: { local: string; ascent: string; descent: string; sizeAdjust: string };
}

const FAMILIES: readonly Family[] = [
  {
    /* Matn va sarlavhalar uchun bitta oila. Zaxira metrikalari hhea 2132/−600 (upm 2000) qiymatidan,
       size-adjust esa a–z harflarining chastotasi boʻyicha hisoblangan. */
    name: "Manrope",
    file: "manrope",
    source: "src/assets/fonts/ManropeUZ[wght].ttf",
    axes: { wght: "400:800" },
    weight: "400 800",
    fallback: { local: "Arial", ascent: "106.6%", descent: "30%", sizeAdjust: "109.7%" },
  },
  {
    /* Katta sarlavhalar uchun Қ Ғ Ҳ harflari qurilgan statik 700 nusxa, hhea 995/−245 (upm 1000).
       a–z boʻyicha Arial Bold shriftidan 1.355 marta keng, shuning uchun override qiymatlari size-adjust qiymatiga boʻlingan. */
    name: "Unbounded",
    file: "unbounded",
    source: "src/assets/fonts/UnboundedUZ-700.ttf",
    axes: {},
    weight: "700",
    fallback: { local: "Arial Bold", ascent: "73.4%", descent: "18.1%", sizeAdjust: "135.5%" },
  },
];

const script = `
import json, sys, os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
spec = json.load(open(sys.argv[1]))
out = spec["out"]
for fam in spec["families"]:
    limits = {}
    for axis, value in fam["axes"].items():
        if ":" in value:
            lo, hi = value.split(":")
            limits[axis] = (float(lo), float(hi))
        else:
            limits[axis] = float(value)
    for name, ranges in spec["subsets"].items():
        # Avval toʻplam, keyin oʻq qisqartirish: teskari tartibda fontTools gvar da KeyError beradi.
        font = TTFont(fam["source"])
        options = subset.Options(flavor="woff2", layout_features=spec["features"], name_IDs=[1, 2, 4, 6], notdef_outline=True, retain_gids=False)
        subsetter = subset.Subsetter(options)
        codepoints = set()
        for part in ranges.replace(" ", "").split(","):
            part = part[2:]
            if "-" in part:
                lo, hi = part.split("-")
                codepoints.update(range(int(lo, 16), int(hi, 16) + 1))
            else:
                codepoints.add(int(part, 16))
        subsetter.populate(unicodes=codepoints)
        subsetter.subset(font)
        if font["maxp"].numGlyphs <= 1:
            continue
        if limits:
            font = instancer.instantiateVariableFont(font, limits, inplace=False, updateFontNames=False)
        target = os.path.join(out, f"{fam['file']}-{name}.woff2")
        font.flavor = "woff2"
        font.save(target)
        print(f"{fam['file']}-{name}.woff2\\t{os.path.getsize(target)//1024} KB")
`;

/* Faqat sayt ishlatadigan OpenType xususiyatlari qoladi, ortiqcha muqobil gliflar tashlanib fayl yengillashadi. */
const FEATURES = [
  "kern",
  "liga",
  "clig",
  "calt",
  "ccmp",
  "locl",
  "mark",
  "mkmk",
  "rlig",
  "rvrn",
  "tnum",
  "lnum",
  "pnum",
  "case",
  "cv05",
];

const spec = path.resolve(".verify/fonts-spec.json");
mkdirSync(path.dirname(spec), { recursive: true });
writeFileSync(
  spec,
  JSON.stringify({ out: OUT, subsets: SUBSETS, families: FAMILIES, features: FEATURES }),
);
execFileSync(python, ["-c", script, spec], { stdio: "inherit" });

let css = `/* scripts/fonts.mts yaratgan: Manrope UZ va Unbounded UZ toʻplamlari, til boʻyicha unicode-range. Qoʻlda tahrir qilinmaydi. */\n`;
for (const family of FAMILIES) {
  for (const [name, range] of Object.entries(SUBSETS)) {
    const file = `${family.file}-${name}.woff2`;
    if (!existsSync(path.join(OUT, file))) continue;
    css += `@font-face {\n  font-family: "${family.name}";\n  font-style: normal;\n  font-weight: ${family.weight};\n  font-display: swap;\n  src: url("/fonts/${file}") format("woff2");\n  unicode-range: ${range};\n}\n`;
  }
  const f = family.fallback;
  css += `@font-face {\n  font-family: "${family.name} Fallback";\n  src: local("${f.local}");\n  ascent-override: ${f.ascent};\n  descent-override: ${f.descent};\n  line-gap-override: 0%;\n  size-adjust: ${f.sizeAdjust};\n}\n`;
}
writeFileSync(path.resolve("src/styles/fonts.css"), css);
console.log("src/styles/fonts.css yozildi");
