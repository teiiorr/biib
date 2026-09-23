import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { ROOT, fail, pass, readText } from "./util.mjs";

const SCORE_KEYS = ["atlas", "birlashma", "shared"];
const FINDING_KEYS = ["blocker", "major", "minor", "ideas"];

function parseScalar(raw) {
  const text = raw.trim();
  if (text === "null" || text === "~" || text === "") return null;
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  return text.replace(/^["']|["']$/g, "");
}

/** Oddiy YAML: `kalit: qiymat` va bir qatorli `{ a: 1, b: 2 }` xaritalar. */
export function parseScorecard(text) {
  const lines = text.split("\n");
  const errors = [];
  if (lines[0]?.trim() !== "---")
    return { front: {}, evidence: [], errors: ["front matter --- bilan boshlanmaydi"] };
  const end = lines.findIndex((line, i) => i > 0 && line.trim() === "---");
  if (end < 0) return { front: {}, evidence: [], errors: ["front matter yopilmagan"] };
  const front = {};
  for (const line of lines.slice(1, end)) {
    const match = line.match(/^([\w.-]+):\s*(.*)$/);
    if (!match) {
      if (line.trim()) errors.push(`tushunarsiz qator: ${line}`);
      continue;
    }
    const [, key, value] = match;
    if (value.trim().startsWith("{")) {
      const inner = value.trim().replace(/^\{|\}$/g, "");
      const map = {};
      for (const part of inner.split(",")) {
        const pair = part.match(/^\s*([\w.-]+)\s*:\s*(.*?)\s*$/);
        if (pair) map[pair[1]] = parseScalar(pair[2]);
        else if (part.trim()) errors.push(`${key}: tushunarsiz juftlik «${part.trim()}»`);
      }
      front[key] = map;
    } else front[key] = parseScalar(value);
  }
  const body = lines.slice(end + 1).join("\n");
  const evidence = [...body.matchAll(/evidence:\s*`?([^\s`,;)]+)`?/g)].map((m) => m[1]);
  return { front, evidence, errors };
}

export function flattenScores(front) {
  const out = {};
  for (const group of SCORE_KEYS) {
    const map = front[group];
    if (map && typeof map === "object")
      for (const [k, v] of Object.entries(map)) out[`${group}.${k}`] = v;
  }
  return out;
}

export function readFindings(front) {
  const raw = front.findings && typeof front.findings === "object" ? front.findings : {};
  const out = {};
  for (const key of FINDING_KEYS) out[key] = typeof raw[key] === "number" ? raw[key] : 0;
  return out;
}

export function runScorecard(ctx) {
  const file = path.join(ROOT, "docs/qa/scorecard.md");
  if (!existsSync(file)) return [fail("scorecard:file", "docs/qa/scorecard.md yoʻq")];
  const { front, evidence, errors } = parseScorecard(readText("docs/qa/scorecard.md"));
  const checks = [];
  checks.push(
    errors.length
      ? fail("scorecard:front-matter", errors.join("\n"))
      : pass("scorecard:front-matter"),
  );
  const scores = flattenScores(front);
  const nonNumeric = Object.entries(scores).filter(([, v]) => typeof v !== "number");
  const missingGroups = SCORE_KEYS.filter((g) => !front[g] || typeof front[g] !== "object");
  if (missingGroups.length)
    checks.push(fail("scorecard:groups", `yoʻq: ${missingGroups.join(", ")}`));
  if (nonNumeric.length)
    checks.push(fail("scorecard:numeric", nonNumeric.map(([k, v]) => `${k}=${v}`).join(", ")));
  else checks.push(pass("scorecard:numeric", `${Object.keys(scores).length} baho`));
  const findings = readFindings(front);
  const rawFindings = front.findings ?? {};
  const badFindings = FINDING_KEYS.filter((k) => typeof rawFindings[k] !== "number");
  checks.push(
    badFindings.length
      ? fail("scorecard:findings", `raqam emas: ${badFindings.join(", ")}`)
      : pass("scorecard:findings", JSON.stringify(findings)),
  );
  for (const [key, value] of Object.entries(scores)) {
    if (typeof value === "number" && value < 10)
      checks.push(fail(`scorecard:${key}`, `${value} < 10`));
  }
  const expectedTotal = 25;
  if (Object.keys(scores).length !== expectedTotal)
    checks.push(
      fail(
        "scorecard:count",
        `${Object.keys(scores).length} baho, ${expectedTotal} kerak (atlas C1–C12, birlashma C1–C12, shared C13)`,
      ),
    );
  for (const rel of evidence) {
    const full = path.join(ROOT, rel);
    const id = `scorecard:evidence:${rel}`;
    if (!existsSync(full)) checks.push(fail(id, "dalil fayli yoʻq"));
    else if (ctx.mode === "full" && statSync(full).mtimeMs < ctx.startedAt)
      checks.push(fail(id, "dalil fayli shu ishga tushirishdan eski"));
    else checks.push(pass(id));
  }
  if (!evidence.length)
    checks.push(fail("scorecard:evidence", "birorta ham «evidence:» yoʻli yoʻq"));
  return checks;
}
