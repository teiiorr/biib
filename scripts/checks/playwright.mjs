import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { BASE_URL, RESULTS_DIR, ROOT, fail, log, readJson, runLive, tail } from "./util.mjs";

const HOUR = 60 * 60_000;

function collect(gate, design, resultName, status, output) {
  const file = path.join(RESULTS_DIR, `${resultName}.json`);
  const data = existsSync(file) ? readJson(`.verify/results/${resultName}.json`, null) : null;
  if (!data || !Array.isArray(data.checks)) {
    return [
      fail(
        `${gate}:${design}:results`,
        `.verify/results/${resultName}.json yozilmadi (chiqish kodi ${status})\n${tail(output, 15)}`,
      ),
    ];
  }
  copyFileSync(file, path.join(RESULTS_DIR, `${resultName}.${design}.json`));
  const checks = data.checks.map((c) => ({ ...c, id: `${design}:${c.id}` }));
  if ((status !== 0 || data.status === "fail") && !checks.some((c) => c.status === "fail"))
    checks.push(
      fail(
        `${gate}:${design}:exit`,
        `jarayon ${status} bilan tugadi, holat ${data.status}\n${tail(output, 15)}`,
      ),
    );
  return checks;
}

/** Playwright spec: DESIGN va BASE_URL muhit orqali; natija .verify/results/<gate>.json dan olinadi. */
export async function runSpec(gate, spec, design) {
  if (!existsSync(path.join(ROOT, spec))) return [fail(`${gate}:${design}:spec`, `${spec} yoʻq`)];
  mkdirSync(RESULTS_DIR, { recursive: true });
  rmSync(path.join(RESULTS_DIR, `${gate}.json`), { force: true });
  log(`${gate}: ${spec} · ${design}`);
  const result = await runLive("pnpm", ["exec", "playwright", "test", spec], {
    env: { BASE_URL, DESIGN: design },
    timeout: HOUR,
  });
  return collect(gate, design, gate, result.status, result.stdout + result.stderr);
}

/** Yordamchi skript (lighthouse, shots): natija nomi berilsa u ham yigʻiladi. */
export async function runScript(gate, script, design, resultName) {
  if (!existsSync(path.join(ROOT, script)))
    return [fail(`${gate}:${design}:${path.basename(script)}`, `${script} yoʻq`)];
  if (resultName) rmSync(path.join(RESULTS_DIR, `${resultName}.json`), { force: true });
  log(`${gate}: ${script} · ${design}`);
  const result = await runLive("node", [script], {
    env: { BASE_URL, DESIGN: design },
    timeout: HOUR,
  });
  if (!resultName) {
    return result.status === 0
      ? [{ id: `${design}:${path.basename(script, ".mjs")}`, status: "pass" }]
      : [
          fail(
            `${design}:${path.basename(script, ".mjs")}`,
            `chiqish kodi ${result.status}\n${tail(result.stdout + result.stderr, 15)}`,
          ),
        ];
  }
  return collect(gate, design, resultName, result.status, result.stdout + result.stderr);
}

export async function runForDesigns(designs, fn) {
  const checks = [];
  for (const design of designs) checks.push(...(await fn(design)));
  return checks;
}
