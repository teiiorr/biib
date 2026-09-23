import { existsSync } from "node:fs";
import { flattenScores, parseScorecard, readFindings } from "./scorecard.mjs";
import { ROOT, readJson, readText, writeJson } from "./util.mjs";
import path from "node:path";

export function scorecardSnapshot() {
  const file = path.join(ROOT, "docs/qa/scorecard.md");
  if (!existsSync(file))
    return { scorecard: {}, findings: { blocker: 0, major: 0, minor: 0, ideas: 0 } };
  const { front } = parseScorecard(readText("docs/qa/scorecard.md"));
  return { scorecard: flattenScores(front), findings: readFindings(front) };
}

/** cleanPasses: toʻliq oʻtish va nol blocker/major/minor boʻlsa oshadi, aks holda 0. */
export function buildState(ctx, treeHash) {
  const previous = readJson(".verify/state.json", null);
  const { scorecard, findings } = scorecardSnapshot();
  const status = ctx.gates.every((g) => g.status !== "fail") ? "pass" : "fail";
  const clean =
    status === "pass" && findings.blocker === 0 && findings.major === 0 && findings.minor === 0;
  const gates = {};
  for (const gate of ctx.gates) gates[gate.id] = gate.status;
  return {
    status,
    mode: ctx.mode,
    timestamp: new Date().toISOString(),
    treeHash,
    gates,
    scorecard,
    findings,
    cleanPasses: clean ? (Number(previous?.cleanPasses) || 0) + 1 : 0,
    pendingContent: ctx.pending.length,
  };
}

export function writeState(state) {
  writeJson(".verify/state.json", state);
}
