#!/usr/bin/env node
/**
 * Ikki mavzudagi matn kontrastini ölçaydi. Tokenlar tokens.css dan öqiladi,
 * şuning uçun rang özgarsa tekşiruv özi yangilanadi.
 *
 * Talab: oddiy matn 4.5:1, katta matn 3:1 (quyida large: true bilan belgilangan).
 */

import { readFile } from "node:fs/promises";

const AA = 4.5;
const AA_LARGE = 3;

const css = await readFile("src/styles/tokens.css", "utf8");

function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`tokens.css: ${selector} topilmadi`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("\n}", open);
  const body = css.slice(open + 1, close);
  const map = new Map();
  for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    map.set(name, value.trim());
  }
  return map;
}

const light = block(":root {");
const darkOverrides = block('html[data-theme="dark"] {');
const dark = new Map([...light, ...darkOverrides]);

function parse(raw, theme) {
  let value = raw.trim();
  const ref = /^var\((--[\w-]+)\)$/.exec(value);
  if (ref) value = theme.get(ref[1]) ?? "";

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
  }

  const rgba = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?\s*\)$/i.exec(value);
  if (rgba) {
    return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3]), rgba[4] === undefined ? 1 : Number(rgba[4])];
  }

  throw new Error(`rangni öqib bölmadi: ${raw}`);
}

/** Şaffof rangni orqa fonga qöyadi. */
function over(fg, bg) {
  const [r, g, b, a] = fg;
  return [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a), 1];
}

function luminance([r, g, b]) {
  const channel = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** fg va bg — token nomlari; base — şaffof qatlamlar ostidagi opaq fon. */
const PAIRS = [
  ["--ink", "--surface"],
  ["--ink", "--surface-2"],
  ["--ink", "--surface-3"],
  ["--ink", "--bg-top"],
  ["--ink", "--bg-bottom"],
  ["--ink-2", "--surface"],
  ["--ink-2", "--surface-2"],
  ["--ink-2", "--footer-to"],
  ["--ink-muted", "--surface"],
  ["--ink-muted", "--surface-2"],
  ["--ink-muted", "--footer-to"],
  ["--blue-deep", "--surface"],
  ["--blue-deep", "--surface-2"],
  ["--blue-deep", "--blue-soft", "--surface"],
  ["--ink-inverse", "--blue-cta"],
  ["--ink-inverse", "--blue-cta-hover"],
  ["--ink-on-accent", "--sun"],
  ["--ink-on-accent", "--coral"],
  ["--ink-on-accent", "--grass"],
  ["--ink-on-accent", "--pink"],
  ["--ink-on-accent", "--grape"],
  ["--sun-ink", "--surface"],
  ["--coral-ink", "--surface"],
  ["--grass-ink", "--surface"],
  ["--pink-ink", "--surface"],
  ["--grape-ink", "--surface"],
  ["--sun-ink", "--sun-soft", "--surface"],
  ["--coral-ink", "--coral-soft", "--surface"],
  ["--grass-ink", "--grass-soft", "--surface"],
  ["--pink-ink", "--pink-soft", "--surface"],
  ["--grape-ink", "--grape-soft", "--surface"],
  ["--stage-ink", "--stage-bg"],
  ["--stage-ink-2", "--stage-bg"],
  ["--ink-inverse", "--blue-cta", "--stage-bg"],
  ["--ink", "--glass-fill-strong", "--bg-top"],
  ["--ink-2", "--glass-fill", "--bg-top"],
];

let failed = 0;
const rows = [];

for (const [name, theme] of [["yorugʻ", light], ["qorongʻi", dark]]) {
  for (const [fgToken, bgToken, baseToken] of PAIRS) {
    const base = parse(theme.get(baseToken ?? "--bg-bottom") ?? "#ffffff", theme);
    const bg = over(parse(theme.get(bgToken), theme), base);
    const fg = over(parse(theme.get(fgToken), theme), bg);
    const value = ratio(fg, bg);
    const ok = value >= AA;
    if (!ok) failed += 1;
    rows.push(
      `${ok ? "  ok " : "  XATO"} ${name.padEnd(9)} ${fgToken.padEnd(16)} on ${(baseToken ? `${bgToken} / ${baseToken}` : bgToken).padEnd(30)} ${value.toFixed(2)}`,
    );
  }
}

console.log(rows.join("\n"));

if (failed) {
  console.error(`\n${failed} juftlik AA (${AA}:1) dan ötmadi. Katta matn uçun ${AA_LARGE}:1 yetadi, ammo bu röyxatda hammasi oddiy matn.`);
  process.exit(1);
}

console.log(`\nKontrast toza — ${rows.length} juftlik, ikkala mavzu.`);
