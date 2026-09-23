import { mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { formatTable, printFailures, writeReport } from "../report.mjs";
import { scanAntiSlop } from "./anti-slop.mjs";
import { runBuild } from "./build.mjs";
import { writeChecklist } from "./checklist.mjs";
import { runHygiene } from "./hygiene.mjs";
import { runLanguage } from "./language.mjs";
import { runForDesigns, runScript, runSpec } from "./playwright.mjs";
import { runProdSmoke } from "./prod.mjs";
import { runScorecard } from "./scorecard.mjs";
import { runSeo } from "./seo.mjs";
import { assertPortsFree, startServer, stopServer } from "./server.mjs";
import { buildState, writeState } from "./state.mjs";
import { runStatic } from "./static.mjs";
import { checkTokenParity } from "./tokens.mjs";
import { computeTreeHash } from "./tree-hash.mjs";
import {
  DESIGNS,
  RESULTS_DIR,
  enableRunLog,
  fail,
  formatDuration,
  log,
  runHelper,
  writeJson,
} from "./util.mjs";
import { applyWaivers, loadWaivers } from "./waivers.mjs";

const NAMES = {
  G0: "Statik",
  G1: "Yigʻish",
  G2: "Marshrutlar",
  G3: "Til",
  G4: "SEO",
  G5: "Maket",
  G6: "Qulaylik",
  G7: "Tezlik",
  G8: "Vizual",
  G9: "Anti-slop",
  G10: "Koʻrik",
  G11: "Gigiyena",
  G12: "Ishlab chiqarish",
  G13: "Dizayn almashuvi",
};
const SERVER_GATES = ["G2", "G4", "G5", "G6", "G7", "G8", "G9", "G13"];

function createContext(mode) {
  const { waivers, errors } = loadWaivers();
  return {
    mode,
    startedAt: Date.now(),
    gates: [],
    waivers,
    waiverErrors: errors,
    usedWaivers: [],
    pending: [],
    site: null,
    shots: [],
  };
}

async function runGate(ctx, id, fn) {
  const started = Date.now();
  log(`${id} ${NAMES[id]} boshlandi`);
  let checks;
  try {
    checks = await fn(ctx);
  } catch (error) {
    checks = [
      fail(`${id}:crash`, error instanceof Error ? (error.stack ?? error.message) : String(error)),
    ];
  }
  if (id === "G0" && ctx.waiverErrors.length)
    checks.push(fail("waivers:invalid", ctx.waiverErrors.join("\n")));
  const applied = applyWaivers(checks, ctx.waivers);
  ctx.usedWaivers.push(...applied.used);
  const status = applied.checks.some((c) => c.status === "fail")
    ? "fail"
    : applied.checks.every((c) => c.status === "skip")
      ? "skip"
      : "pass";
  const gate = { id, name: NAMES[id], status, checks: applied.checks, ms: Date.now() - started };
  ctx.gates.push(gate);
  writeJson(`.verify/results/${id}.summary.json`, { gate: id, status, checks: applied.checks });
  log(`${id} ${status} (${formatDuration(gate.ms)})`);
  return gate;
}

function loadSite(ctx) {
  ctx.site = runHelper("routes.mts");
  ctx.pending = runHelper("pending.mts");
}

function resetResults() {
  mkdirSync(RESULTS_DIR, { recursive: true });
  for (const file of readdirSync(RESULTS_DIR))
    if (file.endsWith(".json")) rmSync(path.join(RESULTS_DIR, file), { force: true });
}

function finish(ctx) {
  console.log("\n" + formatTable(ctx.gates));
  printFailures(ctx.gates);
  const ok = ctx.gates.every((g) => g.status !== "fail");
  console.log(ok ? "\nHammasi oʻtdi." : "\nXatolar bor.");
  return ok;
}

export async function runQuick() {
  const ctx = createContext("quick");
  mkdirSync(RESULTS_DIR, { recursive: true });
  await runGate(ctx, "G0", runStatic);
  await runGate(ctx, "G3", runLanguage);
  await runGate(ctx, "G11", runHygiene);
  const ok = finish(ctx);
  writeReport(ctx, {});
  return ok;
}

export async function runProd() {
  const ctx = createContext("prod");
  mkdirSync(RESULTS_DIR, { recursive: true });
  loadSite(ctx);
  await runGate(ctx, "G12", runProdSmoke);
  const ok = finish(ctx);
  writeReport(ctx, {});
  return ok;
}

const spec = (gate, file) => () => runForDesigns(DESIGNS, (design) => runSpec(gate, file, design));

async function runServerGates(ctx) {
  await runGate(ctx, "G2", spec("G2", "tests/routes.spec.ts"));
  await runGate(ctx, "G4", async () => [
    ...(await runSeo(ctx)),
    ...(await spec("G4", "tests/seo.spec.ts")()),
  ]);
  await runGate(ctx, "G5", spec("G5", "tests/layout.spec.ts"));
  await runGate(ctx, "G6", spec("G6", "tests/a11y.spec.ts"));
  await runGate(ctx, "G7", () =>
    runForDesigns(DESIGNS, async (design) => [
      ...(await runSpec("G7", "tests/perf.spec.ts", design)),
      ...(await runScript("G7", "scripts/lighthouse.mjs", design, "G7-lighthouse")),
    ]),
  );
  await runGate(ctx, "G8", spec("G8", "tests/visual.spec.ts"));
  await runGate(ctx, "G9", () => [...scanAntiSlop(), writeChecklist("full")]);
  await runGate(ctx, "G13", async () => [
    ...checkTokenParity(),
    ...(await spec("G13", "tests/switch.spec.ts")()),
  ]);
  ctx.shots = await runForDesigns(DESIGNS, (design) =>
    runScript("G10", "scripts/shots.mjs", design),
  );
}

export async function runFull() {
  const ctx = createContext("full");
  enableRunLog();
  assertPortsFree();
  resetResults();
  loadSite(ctx);
  await runGate(ctx, "G0", runStatic);
  await runGate(ctx, "G1", runBuild);
  await runGate(ctx, "G3", runLanguage);
  let server = null;
  try {
    server = await startServer();
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    for (const id of SERVER_GATES) await runGate(ctx, id, () => [fail(`${id}:server`, reason)]);
  }
  if (server) {
    try {
      await runServerGates(ctx);
    } finally {
      await stopServer(server);
    }
  }
  await runGate(ctx, "G10", (c) => [...c.shots, ...runScorecard(c)]);
  await runGate(ctx, "G11", runHygiene);
  const ok = finish(ctx);
  /* Hisobot va holat yozilgach xesh eng oxirida hisoblanadi (docs/qa va .verify xeshga kirmaydi). */
  writeReport(ctx, {});
  const state = buildState(ctx, computeTreeHash());
  writeReport(ctx, { treeHash: state.treeHash, state });
  writeState(state);
  log(
    `state.json: ${state.status}, cleanPasses=${state.cleanPasses}, treeHash=${state.treeHash.slice(0, 12)}…`,
  );
  return ok;
}
