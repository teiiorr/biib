import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, fail, grepLines, listSourceFiles, pass, readText } from "./util.mjs";

const CODE_EXT = [".ts", ".tsx", ".css"];
const STEPS = new Set(["0", "1", "2", "3", "4", "6", "8", "12", "16", "24", "32"]);
const RADII = new Set(["s", "m", "card", "control", "panel", "full", "none"]);
const SPACING_UTILS =
  "p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|right|bottom|left|start|end|indent|scroll-m[trblxyse]?|scroll-p[trblxyse]?";
const VARIANT = "(?:[\\w-]+:)*";
const STEP_RE = new RegExp(
  `(?<![\\w-])${VARIANT}-?(?:${SPACING_UTILS})-(\\d+(?:\\.\\d+)?)(?![\\w-])`,
  "g",
);
const ARBITRARY_RE = new RegExp(
  `(?<![\\w-])${VARIANT}-?[\\w-]+-\\[[^\\]]*\\d(?:px|rem|em|vh|vw|svh|dvh|%)\\]`,
  "g",
);
const RADIUS_RE =
  /(?<![\w-])(?:[\w-]+:)*rounded(?:-(?:t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee)(?=-))?(?:-([\w.[\]/-]+))?(?![\w-])/g;

/** docs/qa/decisions.md D14 qatoridagi backtick ichidagi qiymatlar ruxsat roʻyxati. */
export function arbitraryAllowlist() {
  const file = path.join(ROOT, "docs/qa/decisions.md");
  if (!existsSync(file)) return new Set();
  const row = readText("docs/qa/decisions.md")
    .split("\n")
    .find((line) => /^\|\s*D14\s*\|/.test(line));
  if (!row) return new Set();
  return new Set([...row.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim()));
}

/** Kod ichidagi oddiy `rounded` soʻzi (oʻzgaruvchi nomi) class emas: faqat satr literalida yoki CSS da sanaladi. */
function insideClassString(hit, file) {
  if (file.endsWith(".css")) return true;
  const before = hit.text.slice(0, Math.max(0, hit.text.indexOf(hit.match)));
  return (before.match(/["'`]/g) ?? []).length % 2 === 1;
}

function collect(files, regex, keep) {
  const hits = [];
  for (const file of files) {
    for (const hit of grepLines(file, regex)) {
      if (!keep(hit, file)) continue;
      hits.push(`${file}:${hit.line}: ${hit.match}`);
    }
  }
  return hits;
}

function report(id, hits, note) {
  if (!hits.length) return pass(id, note);
  const shown = hits.slice(0, 10).join("\n");
  return fail(
    id,
    shown + (hits.length > 10 ? `\n… jami ${hits.length}` : "") + (note ? `\n${note}` : ""),
  );
}

export function scanSpacing(files = listSourceFiles(CODE_EXT)) {
  const allow = arbitraryAllowlist();
  const steps = collect(files, STEP_RE, (hit) => {
    const value = hit.match.match(/-(\d+(?:\.\d+)?)$/)?.[1] ?? "";
    return !STEPS.has(value);
  });
  const arbitrary = collect(files, ARBITRARY_RE, (hit) => {
    const value = hit.match.match(/\[[^\]]+\]/)?.[0] ?? "";
    const bare = hit.match.replace(/^(?:[\w-]+:)*/, "");
    return !allow.has(hit.match) && !allow.has(bare) && !allow.has(value);
  });
  const radii = collect(files, RADIUS_RE, (hit, file) => {
    const value = hit.match
      .replace(/^(?:[\w-]+:)*rounded/, "")
      .replace(/^-(?:t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee)(?=-)/, "");
    if (value === "" && !insideClassString(hit, file)) return false;
    return !RADII.has(value.replace(/^-/, ""));
  });
  return [
    report(
      "spacing:steps",
      steps,
      "ruxsat: 0,1,2,3,4,6,8,12,16,24,32 (kenglik/balandlik tekshirilmaydi)",
    ),
    report(
      "spacing:arbitrary",
      arbitrary,
      `D14 ruxsat roʻyxati: ${allow.size ? [...allow].join(", ") : "boʻsh"}`,
    ),
    report("radius:tokens", radii, "ruxsat: s, m, card, control, panel, full, none"),
  ];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const checks = scanSpacing();
  for (const c of checks)
    console.log(
      `${c.status.padEnd(4)} ${c.id}${c.detail ? "\n  " + c.detail.replace(/\n/g, "\n  ") : ""}`,
    );
  process.exit(checks.some((c) => c.status === "fail") ? 1 : 0);
}
