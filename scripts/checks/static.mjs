import path from "node:path";
import { scanAntiSlop } from "./anti-slop.mjs";
import { checkContrast } from "./contrast.mjs";
import { scanSpacing } from "./spacing.mjs";
import { checkTokenParity } from "./tokens.mjs";
import { ROOT, fail, listTreeFiles, log, pass, pnpm, tail } from "./util.mjs";

const PRETTIER_EXT = new Set([
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".md",
  ".mdx",
  ".yaml",
  ".yml",
  ".html",
]);
const more = (lines, shown) => (lines.length > shown ? `\n… jami ${lines.length}` : "");

export function runTsc() {
  const result = pnpm(["tsc", "--noEmit", "--pretty", "false"], { timeout: 600_000 });
  if (result.status === 0) return pass("static:tsc");
  const lines = result.stdout.split("\n").filter((line) => /error TS\d+/.test(line));
  return fail(
    "static:tsc",
    (lines.slice(0, 15).join("\n") || tail(result.stdout + result.stderr, 15)) + more(lines, 15),
  );
}

export function runEslint() {
  const result = pnpm(["eslint", ".", "--max-warnings", "0", "--format", "json"], {
    timeout: 900_000,
  });
  if (result.status === 0) return pass("static:eslint");
  try {
    const lines = [];
    for (const file of JSON.parse(result.stdout))
      for (const m of file.messages)
        lines.push(
          `${path.relative(ROOT, file.filePath)}:${m.line ?? 0}:${m.column ?? 0}: ${m.message} (${m.ruleId ?? "?"})`,
        );
    if (lines.length) return fail("static:eslint", lines.slice(0, 15).join("\n") + more(lines, 15));
  } catch {
    /* JSON emas: konfiguratsiya xatosi pastda koʻrsatiladi. */
  }
  return fail("static:eslint", tail(result.stderr || result.stdout, 12));
}

export function runPrettier() {
  const files = listTreeFiles().filter((file) => PRETTIER_EXT.has(path.extname(file)));
  const result = pnpm(["prettier", "--check", ...files], { timeout: 600_000 });
  if (result.status === 0) return pass("static:prettier", `${files.length} fayl`);
  const bad = (result.stderr + "\n" + result.stdout)
    .split("\n")
    .filter((line) => /^\[warn\] /.test(line) && !/Code style issues/.test(line))
    .map((line) => line.replace(/^\[warn\] /, ""));
  return fail(
    "static:prettier",
    (bad.length ? bad.join("\n") : tail(result.stderr, 10)) +
      "\n→ pnpm exec prettier --write <fayl>",
  );
}

export function runKnip() {
  const result = pnpm(["knip", "--reporter", "json"], { timeout: 600_000 });
  if (result.status === 0) return pass("static:knip");
  const lines = [];
  try {
    for (const issue of JSON.parse(result.stdout).issues ?? []) {
      for (const [kind, items] of Object.entries(issue)) {
        if (!Array.isArray(items) || !items.length) continue;
        const names = items.map((item) =>
          typeof item === "string" ? item : (item.name ?? JSON.stringify(item)),
        );
        lines.push(
          kind === "files"
            ? `${issue.file}: ishlatilmagan fayl`
            : `${issue.file}: ${kind}: ${names.join(", ")}`,
        );
      }
    }
  } catch {
    return fail("static:knip", tail(result.stdout + result.stderr, 20));
  }
  return lines.length
    ? fail("static:knip", lines.slice(0, 15).join("\n") + more(lines, 15))
    : fail("static:knip", tail(result.stdout + result.stderr, 20));
}

export async function runStatic() {
  const checks = [];
  for (const [label, step] of [
    ["tsc", runTsc],
    ["eslint", runEslint],
    ["prettier", runPrettier],
    ["knip", runKnip],
  ]) {
    log(`G0: ${label}`);
    checks.push(step());
  }
  log("G0: greplar, token pariteti, kontrast");
  checks.push(...scanAntiSlop(), ...scanSpacing(), ...checkTokenParity(), ...checkContrast());
  return checks;
}
