import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../../", import.meta.url));
export const RESULTS_DIR = path.join(ROOT, ".verify", "results");

/** Darvoza holati: birorta tekshiruv yiqilsa fail, "skip" hisobga olinmaydi. */
export function gateStatus(checks) {
  return checks.some((check) => check.status === "fail") ? "fail" : "pass";
}

export function writeGateResult(gate, checks, extra = {}) {
  mkdirSync(RESULTS_DIR, { recursive: true });
  const file = path.join(RESULTS_DIR, `${gate}.json`);
  const payload = {
    gate,
    status: gateStatus(checks),
    generatedAt: new Date().toISOString(),
    ...extra,
    checks,
  };
  writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`);
  return file;
}

export function readGateResult(gate) {
  const file = path.join(RESULTS_DIR, `${gate}.json`);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, "utf8"));
}
