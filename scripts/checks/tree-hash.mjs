import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ROOT, listTreeFiles } from "./util.mjs";

/* Yaratiladigan chiqish fayllari xeshni oʻzgartirmasligi kerak. */
const EXCLUDE = [
  /^test-results\//,
  /^playwright-report\//,
  /^\.lighthouse\//,
  /^next-env\.d\.ts$/,
  /^docs\/qa\//,
  /^\.verify\//,
  /^\.next\//,
];

export function treeFiles() {
  return listTreeFiles()
    .filter((file) => !EXCLUDE.some((re) => re.test(file)))
    .sort();
}

export function computeTreeHash() {
  const hash = createHash("sha256");
  for (const file of treeFiles()) {
    hash.update(file);
    hash.update("\0");
    hash.update(readFileSync(path.join(ROOT, file)));
    hash.update("\0");
  }
  return hash.digest("hex");
}
