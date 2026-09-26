import { fileURLToPath } from "node:url";
import { THEMES, TOKEN_FILE, parseTokenScopes } from "./tokens.mjs";
import { fail, pass, warn } from "./util.mjs";

const TEXT_MIN = 4.5;
const BOUNDARY_MIN = 3;
const GROUNDS = ["bg", "surface", "surface-2"];
const TEXT_TOKENS = [
  "ink",
  "ink-2",
  "ink-3",
  "tint",
  "accent-text",
  "success",
  "info",
  "danger",
].concat([1, 2, 3, 4, 5, 6, 7].map((n) => `art-${n}-text`));
const BOUNDARY_TOKENS = ["line-strong", "focus"];
/* Uchta eng ogʻir fon: oq surat, eng qora surat va eng yorugʻ pushti kadr. */
const BACKDROPS = {
  dark: ["#FFFFFF", "#0A0A0A", "#F07AAE"],
};
const CORNERS = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
];

export function parseColor(value) {
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const s = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1];
    return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
  }
  const rgb = value.trim().match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  return null;
}

function luminance([r, g, b]) {
  const channel = (c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const composite = (top, bottom, alpha) =>
  top.map((v, i) => Math.round(v * alpha + bottom[i] * (1 - alpha)));

/* globals.css dagi formulalar: --g-tint va matn ostidagi pastki chegara --g-tint-text. */
export const tintText = (t) => Math.max(0.3 - 0.28 * t, 0.1);

function pair(id, fg, bg, min, note) {
  if (!fg || !bg) return warn(id, "rang hex emas, oʻtkazib yuborildi");
  const ratio = contrastRatio(fg, bg);
  const detail = `${ratio.toFixed(2)}${note ? " " + note : ""}`;
  return ratio >= min ? pass(id, detail) : fail(id, `${detail} < ${min}`);
}

export function checkContrast() {
  const checks = [];
  const scopes = parseTokenScopes(TOKEN_FILE);
  for (const theme of THEMES) {
    const tokens = scopes[theme] ?? {};
    const color = (name) => (tokens[name] ? parseColor(tokens[name]) : null);
    const prefix = `contrast:${theme}`;
    for (const ground of GROUNDS) {
      for (const token of TEXT_TOKENS)
        checks.push(pair(`${prefix}:${token}/${ground}`, color(token), color(ground), TEXT_MIN));
      for (const token of BOUNDARY_TOKENS)
        checks.push(
          pair(`${prefix}:${token}/${ground}`, color(token), color(ground), BOUNDARY_MIN),
        );
    }
    checks.push(pair(`${prefix}:on-tint/tint`, color("on-tint"), color("tint"), TEXT_MIN));
    checks.push(
      pair(`${prefix}:on-tint/tint-hover`, color("on-tint"), color("tint-hover"), TEXT_MIN),
    );

    const base = color("material-base");
    const ink = color("material-ink");
    /* §10.1.3: yorugʻ rasm ustida oyna yorugʻ muzga oʻtadi (--glass-light-*, Picture data-tone), shu
       sabab oq fonda ikkinchi ohang sinaladi. */
    const lightBase = color("glass-light-base");
    const lightInk = color("glass-light-ink");
    for (const [t, d] of CORNERS) {
      for (const backdrop of BACKDROPS[theme]) {
        const id = `${prefix}:material:t${t * 100}/d${d * 100}/${backdrop}`;
        if (!base || !ink) {
          checks.push(warn(id, "material tokenlari hex emas"));
          continue;
        }
        const alpha = tintText(t);
        const ground = composite(base, parseColor(backdrop), alpha);
        const own = contrastRatio(ink, ground);
        if (own >= TEXT_MIN) {
          checks.push(pass(id, `${own.toFixed(2)} (alfa ${alpha.toFixed(2)})`));
          continue;
        }
        const adaptive =
          lightBase && lightInk
            ? contrastRatio(lightInk, composite(lightBase, parseColor(backdrop), alpha))
            : 0;
        if (adaptive >= TEXT_MIN)
          checks.push(
            warn(
              id,
              `oʻz ohangi ${own.toFixed(2)} < ${TEXT_MIN}; yorugʻ rasm ustida muz yorugʻ: ${adaptive.toFixed(2)} (alfa ${alpha.toFixed(2)})`,
            ),
          );
        else
          checks.push(
            fail(
              id,
              `${own.toFixed(2)} < ${TEXT_MIN}, yorugʻ muz ham ${adaptive.toFixed(2)} (alfa ${alpha.toFixed(2)})`,
            ),
          );
      }
    }
  }
  return checks;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const checks = checkContrast();
  for (const c of checks)
    if (c.status !== "pass" || process.argv.includes("--all"))
      console.log(`${c.status.padEnd(4)} ${c.id}: ${c.detail ?? ""}`);
  const failed = checks.filter((c) => c.status === "fail").length;
  console.log(
    `${checks.length} juftlik, ${failed} xato, ${checks.filter((c) => c.status === "warn").length} ogohlantirish`,
  );
  process.exit(failed ? 1 : 0);
}
