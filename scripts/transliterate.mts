/**
 * uz/ lugʻatlaridan oz/ (kirill) va ozbekca/ (2026 imlosi) fayllarini yaratadi.
 * Ishga tushirish: pnpm translit. Qoʻlda tuzatishlar oz/overrides.ts va ozbekca/overrides.ts da.
 */
import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { latinToCyrillic, latinToReform } from "../src/i18n/translit/index";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "src/i18n/dictionaries/uz");

type Leaf = string | number | boolean | null;
type Tree = { [key: string]: Tree | Leaf | readonly (Tree | Leaf)[] };

function walk(value: unknown, fn: (s: string) => string): unknown {
  if (typeof value === "string") return fn(value);
  if (Array.isArray(value)) return value.map((v) => walk(v, fn));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Tree)) out[k] = walk(v, fn);
    return out;
  }
  return value;
}

function serialize(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    return `[\n${value.map((v) => pad + "  " + serialize(v, indent + 1)).join(",\n")},\n${pad}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Tree);
    if (!entries.length) return "{}";
    return `{\n${entries
      .map(
        ([k, v]) =>
          `${pad}  ${/^[a-zA-Z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${serialize(v, indent + 1)}`,
      )
      .join(",\n")},\n${pad}}`;
  }
  return String(value);
}

async function main(): Promise<void> {
  const files = readdirSync(SRC).filter((f) => f.endsWith(".ts") && f !== "index.ts");
  const targets: ReadonlyArray<readonly [string, (s: string) => string]> = [
    ["oz", latinToCyrillic],
    ["ozbekca", latinToReform],
  ];
  for (const [dir, fn] of targets) {
    const outDir = path.join(ROOT, "src/i18n/dictionaries", dir);
    mkdirSync(outDir, { recursive: true });
    for (const file of files) {
      const mod = (await import(pathToFileURL(path.join(SRC, file)).href)) as Record<
        string,
        unknown
      >;
      const name = path.basename(file, ".ts");
      const exportName = Object.keys(mod).find((k) => k !== "default");
      if (!exportName) continue;
      const generated = walk(mod[exportName], fn);
      const source =
        `// Avtomatik: scripts/transliterate.mts uz/${file} dan. Qoʻlda tuzatish uchun overrides.ts.\n` +
        `import type { ${exportName} as source } from "../uz/${name}";\n\n` +
        `export const ${exportName}: typeof source = ${serialize(generated)};\n`;
      writeFileSync(path.join(outDir, file), source);
    }
    console.log(`${dir}: ${files.length} fayl yozildi`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
