/*
 * Nunito da ʻ (U+02BB) va ʼ (U+02BC) yarim kegl kenglikda chizilgan (0.5 em, chiziq 0.07 em):
 * «oʻz» matnda «o ʻ z» boʻlib koʻrinadi. Shu ikki belgi uchun Nunito ning oʻz ‘ va ’ glifi
 * (normal kenglik) olinadi va kichik woff2 ga yoziladi; birlashma.css uni unicode-range bilan
 * Nunito dan oldin qoʻyadi. fontTools va brotli kerak (PYTHON muhit oʻzgaruvchisi).
 */
import { execFileSync } from "node:child_process";
import path from "node:path";

const SOURCE = path.resolve("src/assets/fonts/Nunito[wght].ttf");
const TARGET = path.resolve("public/fonts/tutuq-nunito.woff2");
const python = process.env.PYTHON ?? "python3";

const script = `
import sys, os
from fontTools.ttLib import TTFont
from fontTools import subset
source, target = sys.argv[1:3]
font = TTFont(source)
cmap = font.getBestCmap()
left, right = cmap[0x2018], cmap[0x2019]
options = subset.Options(flavor="woff2", layout_features=[], name_IDs=[1, 2, 4, 6], notdef_outline=True)
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=[0x2018, 0x2019])
subsetter.subset(font)
# Tutuq va oʻ belgisi kavsning oʻz shakli va kengligini oladi.
for table in font["cmap"].tables:
    if table.isUnicode():
        table.cmap[0x02BB] = left
        table.cmap[0x02BC] = right
font.flavor = "woff2"
font.save(target)
print(f"{os.path.basename(target)}\\t{os.path.getsize(target)} B")
`;
execFileSync(python, ["-c", script, SOURCE, TARGET], { stdio: "inherit" });
