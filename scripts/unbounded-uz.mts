/*
 * Sarlavhalar uchun Unbounded (egasining tanlovi) oʻzbek kirillining Қ қ Ғ ғ Ҳ ҳ harflarini qamramaydi.
 * Skript Unbounded ni sarlavha qalinligida (wght 700) statik nusxaga aylantiradi va bu harflarni shriftning
 * oʻz shakllaridan quradi: Қ қ Ҳ ҳ → К к Х х + Ц ц dumining chuqurligida oʻng oyoq ostida dum (kengligi
 * I / l ustuni), Ғ ғ → Г г + ustun orqali koʻndalang chiziq. ʻ va ʼ Unbounded da bor va toʻgʻri shaklda.
 * Natija: src/assets/fonts/UnboundedUZ-700.ttf (sayt toʻplamlari, qahramon va OG rasmlari uchun manba).
 * fontTools va brotli kerak (PYTHON muhit oʻzgaruvchisi).
 */
import { execFileSync } from "node:child_process";
import path from "node:path";

const SOURCE = path.resolve("src/assets/fonts/Unbounded[wght].ttf");
const TARGET = path.resolve("src/assets/fonts/UnboundedUZ-700.ttf");
const python = process.env.PYTHON ?? "python3";

const script = String.raw`
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen

SRC, OUT = sys.argv[1], sys.argv[2]
font = instancer.instantiateVariableFont(TTFont(SRC), {"wght": 700}, updateFontNames=False)
cmap = font.getBestCmap()
name = lambda cp: cmap[cp]
glyf, hmtx = font["glyf"], font["hmtx"]

def bounds(g):
    gl = glyf[g]
    gl.recalcBounds(glyf)
    return gl.xMin, gl.yMin, gl.xMax, gl.yMax

def stem(g):
    x0, _, x1, _ = bounds(g)
    return x1 - x0

def rect(x0, y0, x1, y1):
    # TrueType tashqi kontur soat mili boʻyicha
    return [(x0, y0), (x0, y1), (x1, y1), (x1, y0)]

def descender(base, ref_desc, stem_glyph):
    x0, y0, x1, y1 = bounds(base)
    s = stem(stem_glyph)
    return [rect(x1 - s, bounds(ref_desc)[1], x1, s * 0.6)]

def bar(base, stem_glyph, frac):
    x0, y0, x1, y1 = bounds(base)
    s = stem(stem_glyph)
    t = s * 0.82
    cy = y1 * frac
    return [rect(max(4, x0 - s * 0.45), cy - t / 2, x0 + s + (x1 - x0 - s) * 0.42, cy + t / 2)]

JOBS = {
    0x49A: (0x41A, lambda: descender(name(0x41A), name(0x426), "I")),
    0x49B: (0x43A, lambda: descender(name(0x43A), name(0x446), "l")),
    0x4B2: (0x425, lambda: descender(name(0x425), name(0x426), "I")),
    0x4B3: (0x445, lambda: descender(name(0x445), name(0x446), "l")),
    0x492: (0x413, lambda: bar(name(0x413), "I", 0.47)),
    0x493: (0x433, lambda: bar(name(0x433), "l", 0.47)),
}

order = font.getGlyphOrder()
for cp, (base_cp, make) in JOBS.items():
    base = name(base_cp)
    gname = "uni%04X" % cp
    pen = TTGlyphPen(font.getGlyphSet())
    rec = DecomposingRecordingPen(font.getGlyphSet())
    font.getGlyphSet()[base].draw(rec)
    rec.replay(pen)
    for pts in make():
        pen.moveTo(pts[0])
        for p in pts[1:]:
            pen.lineTo(p)
        pen.closePath()
    glyph = pen.glyph()
    order.append(gname)
    glyf.glyphs[gname] = glyph
    glyph.recalcBounds(glyf)
    hmtx[gname] = (hmtx[base][0], glyph.xMin)
    for t in font["cmap"].tables:
        if t.isUnicode():
            t.cmap[cp] = gname

font.setGlyphOrder(order)
font["maxp"].numGlyphs = len(order)
font["OS/2"].usWeightClass = 700
for rec in font["name"].names:
    if rec.nameID in (1, 4, 16):
        rec.string = rec.toUnicode().replace("Unbounded", "Unbounded UZ")
font.save(OUT)
print("saved", OUT, len(order))
`;

execFileSync(python, ["-c", script, SOURCE, TARGET], { stdio: "inherit" });
