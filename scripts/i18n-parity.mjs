#!/usr/bin/env node
/**
 * Beş lugatda bir xil kalitlar borligini tekşiradi.
 * Bitta kalit tuşib qolsa sayt öşa joyda kalit nomini körsatadi.
 */

import { readFile } from "node:fs/promises";

const MASTER = "uz-Latn";
const LOCALES = ["uz-Latn", "uz-Cyrl", "uz-Latn-x-reform", "ru", "en"];

function leaves(node, prefix = "", out = new Set()) {
  if (node && typeof node === "object" && !Array.isArray(node)) {
    for (const [key, value] of Object.entries(node)) {
      leaves(value, prefix ? `${prefix}.${key}` : key, out);
    }
  } else {
    out.add(prefix);
  }
  return out;
}

const dictionaries = Object.fromEntries(
  await Promise.all(
    LOCALES.map(async (locale) => [
      locale,
      leaves(JSON.parse(await readFile(`messages/${locale}.json`, "utf8"))),
    ]),
  ),
);

const master = dictionaries[MASTER];
let failed = false;

for (const locale of LOCALES) {
  if (locale === MASTER) continue;
  const missing = [...master].filter((key) => !dictionaries[locale].has(key));
  const extra = [...dictionaries[locale]].filter((key) => !master.has(key));
  if (missing.length || extra.length) {
    failed = true;
    console.error(`${locale}:`);
    for (const key of missing) console.error(`  yetişmaydi  ${key}`);
    for (const key of extra) console.error(`  ortiqça     ${key}`);
  }
}

if (failed) process.exit(1);
console.log(`Lugatlar mos — ${master.size} kalit × ${LOCALES.length} til.`);
