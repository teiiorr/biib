import { mkdirSync } from "node:fs";
import path from "node:path";
import type { TestInfo } from "@playwright/test";

export type Gate = "G2" | "G4" | "G5" | "G6" | "G7" | "G8" | "G13";
export type CheckStatus = "pass" | "fail" | "skip";

export interface GateCheck {
  readonly id: string;
  readonly status: CheckStatus;
  readonly detail?: string;
  readonly evidence?: string;
}

export const CHECK_ATTACHMENT = "gate-check";

/** Test ichida yozilgan natija reporter orqali .verify/results/<gate>.json ga yigʻiladi. */
export async function recordCheck(testInfo: TestInfo, gate: Gate, check: GateCheck): Promise<void> {
  await testInfo.attach(CHECK_ATTACHMENT, {
    body: JSON.stringify({ gate, ...check }),
    contentType: "application/json",
  });
}

export function checkId(testInfo: TestInfo, ...parts: readonly string[]): string {
  return [testInfo.project.name, ...parts].join("/");
}

/** Dalil fayli yoʻli: .verify/evidence/<gate>/...; papka oldindan yaratiladi. */
export function evidenceFile(testInfo: TestInfo, gate: Gate, ...parts: readonly string[]): string {
  const file = path.join(testInfo.config.rootDir, ".verify", "evidence", gate, ...parts);
  mkdirSync(path.dirname(file), { recursive: true });
  return file;
}

export function relativeEvidence(testInfo: TestInfo, file: string): string {
  return path.relative(testInfo.config.rootDir, file);
}

export function summarize(items: readonly string[], limit = 6): string {
  if (items.length <= limit) return items.join("; ");
  return `${items.slice(0, limit).join("; ")}; … +${items.length - limit}`;
}
