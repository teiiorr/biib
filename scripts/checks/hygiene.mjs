import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT, fail, listTreeFiles, pass } from "./util.mjs";

const BINARY =
  /\.(png|jpe?g|gif|webp|avif|ico|mp4|webm|mp3|ogg|woff2?|ttf|otf|pdf|zip|lock|lockb)$/i;
const SKIP = new Set(["pnpm-lock.yaml", ".env.example"]);
const SECRETS = [
  ["private-key", /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/],
  ["aws-key", /\bAKIA[0-9A-Z]{16}\b/],
  ["telegram-token", /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/],
  ["github-token", /\bgh[pousr]_[A-Za-z0-9]{36,}\b/],
  ["slack-token", /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/],
  [
    "generic-secret",
    /\b(?:api[_-]?key|secret|token|password|passwd)\b\s*[:=]\s*["'][^"'\s]{16,}["']/i,
  ],
];

/** Skaner kuzatilmaydigan yashirin papkada turadi; nomi kodda yozilmaydi, shu sabab qidiriladi. */
export function findHygieneScanner() {
  for (const entry of readdirSync(ROOT)) {
    if (!entry.startsWith(".")) continue;
    const full = path.join(ROOT, entry);
    if (!statSync(full).isDirectory()) continue;
    const candidate = path.join(full, "hooks/hygiene.mjs");
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

export function scanSecrets(files = listTreeFiles()) {
  const hits = [];
  for (const file of files) {
    if (BINARY.test(file) || SKIP.has(file)) continue;
    if (/^\.env(?!\.example$)/.test(path.basename(file))) {
      hits.push(`${file}: muhit fayli repoda boʻlmasligi kerak`);
      continue;
    }
    let text;
    try {
      text = readFileSync(path.join(ROOT, file), "utf8");
    } catch {
      continue;
    }
    if (text.includes("\0")) continue;
    const lines = text.split("\n");
    for (const [name, re] of SECRETS)
      lines.forEach((line, i) => {
        if (re.test(line)) hits.push(`${file}:${i + 1}: ${name}`);
      });
  }
  return hits;
}

export async function runHygiene() {
  const checks = [];
  const scanner = findHygieneScanner();
  if (!scanner)
    checks.push(fail("hygiene:scanner", "gigiyena skaneri (hooks/hygiene.mjs) topilmadi"));
  else {
    const mod = await import(pathToFileURL(scanner).href);
    const tracked = mod.scanTrackedFiles();
    const commits = mod.scanUnpushedCommits();
    const exclude = mod.checkExclude();
    checks.push(
      tracked.length
        ? fail("hygiene:tracked", tracked.slice(0, 12).join("\n"))
        : pass("hygiene:tracked"),
    );
    checks.push(
      commits.length
        ? fail("hygiene:commits", commits.slice(0, 12).join("\n"))
        : pass("hygiene:commits"),
    );
    checks.push(
      exclude.length ? fail("hygiene:exclude", exclude.join("\n")) : pass("hygiene:exclude"),
    );
  }
  const secrets = scanSecrets();
  checks.push(
    secrets.length
      ? fail("hygiene:secrets", secrets.slice(0, 12).join("\n"))
      : pass("hygiene:secrets"),
  );
  return checks;
}
