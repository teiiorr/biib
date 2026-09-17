#!/usr/bin/env node
/**
 * Ikki mavzudagi kontrastni ölçaydi. Ranglar tokens.css va glass.css dan
 * öqiladi, şuning uçun token özgarsa tekşiruv özi yangilanadi.
 *
 * AA: oddiy matn 4.5:1. Belgi, yirik matn va yordamçi matn uçun 3:1 —
 * bunday juftliklar quyida "min: 3" bilan belgilangan.
 */

import { readFile } from "node:fs/promises";

const tokens = await readFile("src/styles/tokens.css", "utf8");
const glass = await readFile("src/styles/glass.css", "utf8");

function block(css, selector, from = 0) {
  const start = css.indexOf(selector, from);
  if (start === -1) throw new Error(`${selector} topilmadi`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("\n}", open);
  const map = new Map();
  for (const [, name, value] of css.slice(open + 1, close).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    map.set(name, value.trim());
  }
  return map;
}

const light = new Map([...block(tokens, ":root {"), ...block(glass, ":root {")]);
const dark = new Map([
  ...light,
  ...block(tokens, ':root[data-theme="dark"] {'),
  ...block(glass, ':root[data-theme="dark"] {'),
]);

/** calc(a - b * var(--glass-intensity)) ni standart 0.5 da hisoblaydi. */
function alphaOf(raw) {
  const calc = /^calc\(([\d.]+)\s*-\s*([\d.]+)\s*\*\s*var\(--glass-intensity\)\)$/.exec(raw.trim());
  if (calc) return Number(calc[1]) - Number(calc[2]) * 0.5;
  return Number(raw);
}

function parse(raw, theme) {
  let value = raw.trim();
  const ref = /^var\((--[\w-]+)\)$/.exec(value);
  if (ref) value = (theme.get(ref[1]) ?? "").trim();

  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).concat(1);
  }

  const rgb = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*\/\s*|[,\s]+)?([\d.]+)?\s*\)$/i.exec(value);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3]), rgb[4] === undefined ? 1 : Number(rgb[4])];

  throw new Error(`rangni öqib bölmadi: ${raw}`);
}

/** Şişa yuzasi: tint + hisoblangan alfa. */
function glassOver(theme, variant, base) {
  const tint = (theme.get("--glass-tint") ?? "255 255 255").split(/\s+/).map(Number);
  const raw =
    variant === "thick"
      ? theme.get("--glass-thick-alpha") ?? theme.get("--glass-alpha")
      : theme.get("--glass-alpha");
  return over([...tint, alphaOf(raw ?? "0.7")], base);
}

function over(fg, bg) {
  const [r, g, b, a] = fg;
  return [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a), 1];
}

function luminance([r, g, b]) {
  const ch = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function ratio(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** [matn, fon, ostidagi opaq fon, eng kam nisbat, izoh] */
const PAIRS = [
  ["--label-primary", "--bg-base"],
  ["--label-primary", "--bg-elevated"],
  ["--label-primary", "--bg-sunken"],
  ["--label-secondary", "--bg-base"],
  ["--label-secondary", "--bg-elevated"],
  ["--label-secondary", "--bg-sunken"],
  ["--label-tertiary", "--bg-base", null, 3, "belgi va namuna matn"],
  ["--label-tertiary", "--bg-elevated", null, 3, "belgi va namuna matn"],
  ["--accent-text", "--bg-base"],
  ["--accent-text", "--bg-elevated"],
  ["--accent-text", "--bg-sunken"],
  ["--accent-text", "--accent-wash", "--bg-elevated"],
  ["--accent-contrast", "--accent"],
  ["--accent-contrast", "--accent-hover"],
  ["--accent-contrast", "--accent-pressed"],
  ["--label-primary", "--fill-secondary", "--bg-elevated"],
  ["--label-primary", "--fill-secondary", "--bg-base"],
  ["--danger", "--bg-elevated"],
  ["--label-primary", "@glass", "--bg-base"],
  ["--label-secondary", "@glass", "--bg-base"],
  ["--label-primary", "@glass", "--bg-elevated"],
];

let failed = 0;
const rows = [];

for (const [name, theme] of [["yorugʻ", light], ["qorongʻi", dark]]) {
  for (const [fgToken, bgToken, baseToken, min = 4.5, note] of PAIRS) {
    const base = parse(theme.get(baseToken ?? "--bg-base"), theme);
    const bg = bgToken === "@glass" ? glassOver(theme, "regular", base) : over(parse(theme.get(bgToken), theme), base);
    const fg = over(parse(theme.get(fgToken), theme), bg);
    const value = ratio(fg, bg);
    const ok = value >= min;
    if (!ok) failed += 1;
    const where = baseToken ? `${bgToken} / ${baseToken}` : bgToken;
    rows.push(
      `${ok ? "  ok " : "  XATO"} ${name.padEnd(9)} ${fgToken.padEnd(19)} on ${where.padEnd(28)} ${value.toFixed(2)}  (min ${min})${note ? " — " + note : ""}`,
    );
  }
}

console.log(rows.join("\n"));

if (failed) {
  console.error(`\n${failed} juftlik ötmadi.`);
  process.exit(1);
}

console.log(`\nKontrast toza — ${rows.length} juftlik, ikkala mavzu.`);
