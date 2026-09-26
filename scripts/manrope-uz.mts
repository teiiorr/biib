/*
 * Manrope (egasining tanlovi) oʻzbek belgilarini toʻliq qamramaydi: ʻ ʼ va Қ қ Ғ ғ Ҳ ҳ yoʻq.
 * Bu skript ularni Manrope ning oʻz shakllaridan quradi va «Manrope UZ» ni yozadi:
 * ʻ → Manrope ning ’ glifi 180° burilgan (agʻdarilgan vergul), ʼ → ’ glifi; Қ қ Ҳ ҳ → К к Х х + Ц ц dumining chuqurligida oʻng oyoq ostida dum
 * (kengligi I / l ustuni); Ғ ғ → Г г + ustun orqali koʻndalang chiziq. Ikkala master (wght 200 va 800)
 * alohida quriladi, farqi gvar ga yoziladi: oraliq qalinliklar toʻgʻri interpolyatsiya boʻladi.
 * Natija: src/assets/fonts/ManropeUZ[wght].ttf va OG uchun Manrope-400/700.ttf. fontTools va brotli kerak (PYTHON muhit oʻzgaruvchisi).
 */
import { execFileSync } from "node:child_process";
import path from "node:path";

const SOURCE = path.resolve("src/assets/fonts/Manrope[wght].ttf");
const TARGET = path.resolve("src/assets/fonts/ManropeUZ[wght].ttf");
const python = process.env.PYTHON ?? "python3";

const script = String.raw`
import copy, sys
from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._g_l_y_f import Glyph, GlyphCoordinates
from fontTools.ttLib.tables.TupleVariation import TupleVariation
from fontTools.varLib import instancer
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen

SRC, OUT = sys.argv[1], sys.argv[2]
vf = TTFont(SRC)
lo = instancer.instantiateVariableFont(TTFont(SRC), {"wght": 200}, updateFontNames=False)
hi = instancer.instantiateVariableFont(TTFont(SRC), {"wght": 800}, updateFontNames=False)
cmap = vf.getBestCmap()
name = lambda cp: cmap[cp]

def bounds(font, g):
    gl = font["glyf"][g]
    gl.recalcBounds(font["glyf"])
    return gl.xMin, gl.yMin, gl.xMax, gl.yMax

def stem(font, g):
    x0, _, x1, _ = bounds(font, g)
    return x1 - x0

def rect(x0, y0, x1, y1):
    # TrueType tashqi kontur soat mili boʻyicha
    return [(x0, y0), (x0, y1), (x1, y1), (x1, y0)]

def build(font, base, extra):
    pen = TTGlyphPen(font.getGlyphSet())
    rec = DecomposingRecordingPen(font.getGlyphSet())
    font.getGlyphSet()[base].draw(rec)
    rec.replay(pen)
    for pts in extra:
        pen.moveTo(pts[0])
        for p in pts[1:]:
            pen.lineTo(p)
        pen.closePath()
    return pen.glyph()

def turned(font, base):
    # ʻ (U+02BB) — «agʻdarilgan vergul»: ’ belgisi oʻz qutisi markazi atrofida 180° buriladi.
    # Manrope ‘ belgisi qalin oʻlchamda shaklsiz ponaga oʻxshaydi, burilgan ’ esa aniq «6» shakl.
    x0, y0, x1, y1 = bounds(font, base)
    pen = TTGlyphPen(font.getGlyphSet())
    rec = DecomposingRecordingPen(font.getGlyphSet())
    font.getGlyphSet()[base].draw(rec)
    rec.replay(TransformPen(pen, (-1, 0, 0, -1, x0 + x1, y0 + y1)))
    return pen.glyph()

def descender(font, base, ref_desc, stem_glyph):
    x0, y0, x1, y1 = bounds(font, base)
    s = stem(font, stem_glyph)
    depth = bounds(font, ref_desc)[1]
    return [rect(x1 - s, depth, x1, s * 0.6)]

def bar(font, base, stem_glyph, height_ref, frac):
    x0, y0, x1, y1 = bounds(font, base)
    s = stem(font, stem_glyph)
    h = bounds(font, height_ref)[3]
    t = s * 0.82
    cy = h * frac
    return [rect(max(4, x0 - s * 0.45), cy - t / 2, x0 + s + (x1 - x0 - s) * 0.42, cy + t / 2)]

JOBS = {
    # yangi belgi: (asos, qoʻshimcha quruvchi)
    0x49A: (0x41A, lambda f: descender(f, name(0x41A), name(0x426), "I")),
    0x49B: (0x43A, lambda f: descender(f, name(0x43A), name(0x446), "l")),
    0x4B2: (0x425, lambda f: descender(f, name(0x425), name(0x426), "I")),
    0x4B3: (0x445, lambda f: descender(f, name(0x445), name(0x446), "l")),
    0x492: (0x413, lambda f: bar(f, name(0x413), "I", name(0x413), 0.47)),
    0x493: (0x433, lambda f: bar(f, name(0x433), "l", name(0x433), 0.47)),
}

order = vf.getGlyphOrder()
glyf, hmtx, gvar = vf["glyf"], vf["hmtx"], vf["gvar"]
def add(cp, base_cp, g_lo, g_hi):
    base = name(base_cp)
    gname = "uni%04X" % cp
    c_lo = g_lo.getCoordinates(lo["glyf"])[0]
    c_hi = g_hi.getCoordinates(hi["glyf"])[0]
    assert len(c_lo) == len(c_hi), (gname, len(c_lo), len(c_hi))
    order.append(gname)
    glyf.glyphs[gname] = g_lo
    adv_lo, lsb_lo = lo["hmtx"][base]
    adv_hi, _ = hi["hmtx"][base]
    g_lo.recalcBounds(glyf)
    hmtx[gname] = (adv_lo, g_lo.xMin)
    deltas = [(b[0] - a[0], b[1] - a[1]) for a, b in zip(c_lo, c_hi)]
    # Fantom nuqtalar: chap, oʻng (kenglik), yuqori, past
    deltas += [(0, 0), (adv_hi - adv_lo, 0), (0, 0), (0, 0)]
    gvar.variations[gname] = [TupleVariation({"wght": (0.0, 1.0, 1.0)}, deltas)]
    for t in vf["cmap"].tables:
        if t.isUnicode():
            t.cmap[cp] = gname

for cp, (base_cp, make) in JOBS.items():
    base = name(base_cp)
    add(cp, base_cp, build(lo, base, make(lo)), build(hi, base, make(hi)))
add(0x2BB, 0x2019, turned(lo, name(0x2019)), turned(hi, name(0x2019)))

# Tutuq belgisi ʼ — ’ kavs glifining oʻzi (kenglik va shakl Manrope niki)
for t in vf["cmap"].tables:
    if t.isUnicode():
        t.cmap[0x2BC] = cmap[0x2019]

vf.setGlyphOrder(order)
vf["maxp"].numGlyphs = len(order)
# HVAR yangi belgilarni bilmaydi: kengliklar gvar fantom nuqtalaridan olinadi
if "HVAR" in vf:
    del vf["HVAR"]
for rec in vf["name"].names:
    if rec.nameID in (1, 4, 16):
        rec.string = rec.toUnicode().replace("Manrope", "Manrope UZ")
vf.save(OUT)
print("saved", OUT, len(order))

# OG rasmlari (Satori) oʻzgaruvchan shriftni oʻqimaydi: 400 va 700 statik nusxalar shu manbadan
import os
for w in (400, 700):
    static = instancer.instantiateVariableFont(TTFont(OUT), {"wght": w}, updateFontNames=False)
    static.save(os.path.join(os.path.dirname(OUT), "Manrope-%d.ttf" % w))
    print("saved static", w)
`;

execFileSync(python, ["-c", script, SOURCE, TARGET], { stdio: "inherit" });
