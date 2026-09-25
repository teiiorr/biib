import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { BASE_URL, RESULTS_DIR, ROOT, fail, log, readJson, runLive, tail } from "./util.mjs";

const HOUR = 60 * 60_000;

function collect(gate, resultName, status, output) {
  const file = path.join(RESULTS_DIR, `${resultName}.json`);
  const data = existsSync(file) ? readJson(`.verify/results/${resultName}.json`, null) : null;
  if (!data || !Array.isArray(data.checks)) {
    return [
      fail(
        `${gate}:results`,
        `.verify/results/${resultName}.json yozilmadi (chiqish kodi ${status})\n${tail(output, 15)}`,
      ),
    ];
  }
  const checks = [...data.checks];
  if ((status !== 0 || data.status === "fail") && !checks.some((c) => c.status === "fail"))
    checks.push(
      fail(
        `${gate}:exit`,
        `jarayon ${status} bilan tugadi, holat ${data.status}\n${tail(output, 15)}`,
      ),
    );
  return checks;
}

/** Playwright spec: BASE_URL muhit orqali; natija .verify/results/<gate>.json dan olinadi. */
export async function runSpec(gate, spec) {
  if (!existsSync(path.join(ROOT, spec))) return [fail(`${gate}:spec`, `${spec} yoʻq`)];
  mkdirSync(RESULTS_DIR, { recursive: true });
  rmSync(path.join(RESULTS_DIR, `${gate}.json`), { force: true });
  log(`${gate}: ${spec}`);
  const result = await runLive("pnpm", ["exec", "playwright", "test", spec], {
    env: { BASE_URL },
    timeout: HOUR,
  });
  return collect(gate, gate, result.status, result.stdout + result.stderr);
}

/** Yordamchi skript (lighthouse, shots): natija nomi berilsa u ham yigʻiladi. */
export async function runScript(gate, script, resultName) {
  if (!existsSync(path.join(ROOT, script)))
    return [fail(`${gate}:${path.basename(script)}`, `${script} yoʻq`)];
  if (resultName) rmSync(path.join(RESULTS_DIR, `${resultName}.json`), { force: true });
  log(`${gate}: ${script}`);
  const result = await runLive("node", [script], {
    env: { BASE_URL },
    timeout: HOUR,
  });
  if (!resultName) {
    return result.status === 0
      ? [{ id: path.basename(script, ".mjs"), status: "pass" }]
      : [
          fail(
            path.basename(script, ".mjs"),
            `chiqish kodi ${result.status}\n${tail(result.stdout + result.stderr, 15)}`,
          ),
        ];
  }
  return collect(gate, resultName, result.status, result.stdout + result.stderr);
}
