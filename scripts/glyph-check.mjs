#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFontTables, readCodepoints, readFamily } from "./checks/font-tables.mjs";
import { ROOT, fail, pass, skip } from "./checks/util.mjs";

const RUSSIAN = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёзийклмнопрстуфхцчшщъыьэюя";
export const REQUIRED = [...("ʻʼÖöĞğŞşÇçЎўҚқҒғҲҳ«»„“—…№" + RUSSIAN)];
const FONT_EXT = new Set([".woff2", ".woff", ".ttf", ".otf"]);
const PYTHON = `import json,sys
from fontTools.ttLib import TTFont
out=[]
for f in sys.argv[1:]:
    font=TTFont(f)
    name=font["name"]
    out.append({"file":f,"family":name.getDebugName(16) or name.getDebugName(1) or "","codepoints":sorted((font.getBestCmap() or {}).keys())})
print(json.dumps(out))`;

function findFonts(dirs) {
  const files = [];
  const visit = (dir, depth) => {
    if (!existsSync(dir) || depth > 4) return;
    if (statSync(dir).isFile()) {
      if (FONT_EXT.has(path.extname(dir))) files.push(dir);
      return;
    }
    for (const entry of readdirSync(dir)) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) visit(full, depth + 1);
      // tutuq-* fayllari ataylab ikki belgili (ʻ ʼ tuzatish); oila qamrovi asosiy fayllardan tekshiriladi.
      else if (FONT_EXT.has(path.extname(entry)) && !entry.startsWith("tutuq-")) files.push(full);
    }
  };
  for (const dir of dirs) visit(dir, 0);
  return files;
}

/** fontTools (brotli bilan) boʻlsa u ishlatiladi, boʻlmasa oʻz oʻquvchimiz. */
function withPython(files) {
  const probe = spawnSync("python3", ["-c", "import fontTools, brotli"], { encoding: "utf8" });
  if (probe.status !== 0) return null;
  const result = spawnSync("python3", ["-c", PYTHON, ...files], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.status !== 0) return null;
  return JSON.parse(result.stdout).map((f) => ({ ...f, codepoints: new Set(f.codepoints) }));
}

function withNode(files) {
  return files.map((file) => {
    const tables = parseFontTables(readFileSync(file));
    return {
      file,
      family: readFamily(tables.get("name")),
      codepoints: readCodepoints(tables.get("cmap")),
    };
  });
}

export function fontCoverage(files) {
  const fonts = withPython(files) ?? withNode(files);
  const families = new Map();
  for (const font of fonts) {
    const key = font.family || path.basename(font.file);
    const entry = families.get(key) ?? { family: key, files: [], codepoints: new Set() };
    entry.files.push(path.relative(ROOT, font.file));
    for (const cp of font.codepoints) entry.codepoints.add(cp);
    families.set(key, entry);
  }
  return [...families.values()];
}

export function checkFonts(
  dirs = [path.join(ROOT, ".next/static/media"), path.join(ROOT, "public/fonts")],
) {
  const files = findFonts(dirs);
  if (!files.length)
    return [
      skip(
        "glyphs",
        "shrift fayllari topilmadi: pnpm build dan keyin .next/static/media tekshiriladi",
      ),
    ];
  let families;
  try {
    families = fontCoverage(files);
  } catch (error) {
    return [
      fail("glyphs", `shrift oʻqilmadi: ${error instanceof Error ? error.message : String(error)}`),
    ];
  }
  return families.map((entry) => {
    const missing = REQUIRED.filter((ch) => !entry.codepoints.has(ch.codePointAt(0)));
    const id = `glyphs:${entry.family}`;
    if (!missing.length)
      return pass(id, `${entry.files.length} fayl, ${entry.codepoints.size} belgi`);
    const list = missing.map(
      (ch) => `${ch} (U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")})`,
    );
    return fail(id, `yetishmaydi: ${list.join(" ")}\nfayllar: ${entry.files.join(", ")}`);
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const checks = checkFonts(args.length ? args.map((a) => path.resolve(a)) : undefined);
  for (const c of checks) console.log(`${c.status.padEnd(4)} ${c.id}: ${c.detail ?? ""}`);
  process.exit(checks.some((c) => c.status === "fail") ? 1 : 0);
}
