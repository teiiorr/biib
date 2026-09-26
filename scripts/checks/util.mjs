import { spawn, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const VERIFY_DIR = path.join(ROOT, ".verify");
export const RESULTS_DIR = path.join(VERIFY_DIR, "results");
export const QA_DIR = path.join(ROOT, "docs/qa");
export const BASE_URL = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bolalar-ijodkorligi.uz"
).replace(/\/$/, "");
export const LOCALES = ["uz", "oz", "ozbekca", "ru", "en"];

let logPath = null;

export function enableRunLog() {
  mkdirSync(VERIFY_DIR, { recursive: true });
  logPath = path.join(VERIFY_DIR, "run.log");
  appendFileSync(logPath, `\n=== ${new Date().toISOString()} ===\n`);
}

export function log(line) {
  const stamp = new Date().toISOString().slice(11, 19);
  const text = `[${stamp}] ${line}`;
  console.log(text);
  if (logPath) appendFileSync(logPath, text + "\n");
}

export function logRaw(text) {
  if (logPath && text) appendFileSync(logPath, text.endsWith("\n") ? text : text + "\n");
}

export function check(id, status, detail, evidence) {
  const item = { id, status };
  if (detail) item.detail = detail;
  if (evidence) item.evidence = evidence;
  return item;
}
export const pass = (id, detail) => check(id, "pass", detail);
export const fail = (id, detail, evidence) => check(id, "fail", detail, evidence);
export const skip = (id, detail) => check(id, "skip", detail);
export const warn = (id, detail) => check(id, "warn", detail);

export function stripAnsi(text) {
  return text.replace(/\u001b\[[0-9;]*[A-Za-z]/g, "");
}

export function tail(text, lines = 20) {
  return stripAnsi(text ?? "")
    .trim()
    .split("\n")
    .slice(-lines)
    .join("\n");
}

export function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    cwd: options.cwd ?? ROOT,
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1", ...(options.env ?? {}) },
    timeout: options.timeout,
  });
  return {
    status: result.status ?? -1,
    stdout: stripAnsi(result.stdout ?? ""),
    stderr: stripAnsi(result.stderr ?? "") + (result.error ? `\n${result.error.message}` : ""),
  };
}

export const pnpm = (args, options) => run("pnpm", ["exec", ...args], options);

/** Uzoq jarayonlar: chiqish run.log ga jonli yoziladi, shunda jurnalni kuzatish mumkin. */
export function runLive(cmd, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd: options.cwd ?? ROOT,
      env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1", ...(options.env ?? {}) },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let timer = null;
    const finish = (status) => {
      if (timer) clearTimeout(timer);
      resolve({ status, stdout: stripAnsi(stdout), stderr: stripAnsi(stderr) });
    };
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      logRaw(String(chunk));
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      logRaw(String(chunk));
    });
    child.on("error", (error) => {
      stderr += error.message;
      finish(-1);
    });
    child.on("close", (code) => finish(code ?? -1));
    if (options.timeout) {
      timer = setTimeout(() => {
        stderr += `\nvaqt tugadi (${options.timeout} ms)`;
        child.kill("SIGKILL");
      }, options.timeout);
    }
  });
}

/** Kuzatilayotgan va kuzatilmaydigan (lekin eʼtiborga olinadigan) fayllar: git roʻyxati. */
export function listTreeFiles() {
  const result = run("git", ["ls-files", "-co", "--exclude-standard", "-z"]);
  return result.stdout
    .split("\0")
    .filter(Boolean)
    .filter((file) => existsSync(path.join(ROOT, file)));
}

export function listSourceFiles(extensions, prefix = "src/") {
  return listTreeFiles().filter(
    (file) => file.startsWith(prefix) && extensions.includes(path.extname(file)),
  );
}

export function readText(rel) {
  return readFileSync(path.join(ROOT, rel), "utf8");
}

export function readJson(rel, fallback = null) {
  try {
    return JSON.parse(readFileSync(path.join(ROOT, rel), "utf8"));
  } catch {
    return fallback;
  }
}

export function writeText(rel, text) {
  const full = path.join(ROOT, rel);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, text);
}

export function writeJson(rel, data) {
  writeText(rel, JSON.stringify(data, null, 2) + "\n");
}

/** Fayl qatorlari boʻylab regex: natijada fayl:qator koʻrsatiladi. */
export function grepLines(file, regex, text = readText(file)) {
  const hits = [];
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const re = new RegExp(
      regex.source,
      regex.flags.includes("g") ? regex.flags : regex.flags + "g",
    );
    let match;
    while ((match = re.exec(line))) {
      hits.push({ file, line: i + 1, column: match.index + 1, text: line.trim(), match: match[0] });
      if (match[0] === "") re.lastIndex++;
    }
  }
  return hits;
}

export function formatDuration(ms) {
  if (ms < 1000) return `${ms} ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)} s`;
  return `${Math.floor(ms / 60_000)} min ${Math.round((ms % 60_000) / 1000)} s`;
}

/** tsx yordamchisi: TypeScript manbalarni bajarib JSON qaytaradi. */
export function runHelper(name) {
  const result = pnpm(["tsx", `scripts/checks/${name}`], { timeout: 120_000 });
  if (result.status !== 0) throw new Error(`${name} ishlamadi:\n${tail(result.stderr, 15)}`);
  return JSON.parse(result.stdout);
}
