import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

import { CHECK_ATTACHMENT } from "./helpers/results";

interface Check {
  readonly id: string;
  readonly status: "pass" | "fail" | "skip";
  readonly detail?: string;
  readonly evidence?: string;
}

/** gate-check ilovalarini darvoza boʻyicha .verify/results/<gate>.json ga yigʻadi (kelishuv: conventions). */
class GateReporter implements Reporter {
  private readonly checks = new Map<string, Check[]>();
  private rootDir = process.cwd();

  onBegin(config: FullConfig): void {
    this.rootDir = config.rootDir;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    for (const attachment of result.attachments) {
      if (attachment.name !== CHECK_ATTACHMENT || !attachment.body) continue;
      try {
        const parsed = JSON.parse(attachment.body.toString("utf8")) as Check & { gate: string };
        const { gate, ...check } = parsed;
        const list = this.checks.get(gate) ?? [];
        list.push(check);
        this.checks.set(gate, list);
      } catch {
        continue;
      }
    }
    /* Ilovasiz yiqilgan test ham darvozani yiqitadi: spec nomidan darvoza taxmin qilinadi. */
    if (result.status !== "passed" && result.status !== "skipped") {
      const gate = gateFromFile(test.location.file);
      const list = this.checks.get(gate) ?? [];
      list.push({
        id: `${test.parent.project()?.name ?? "?"}/${test.title}`,
        status: "fail",
        detail: result.error?.message?.slice(0, 400) ?? result.status,
      });
      this.checks.set(gate, list);
    }
  }

  onEnd(_result: FullResult): void {
    const dir = path.join(this.rootDir, ".verify", "results");
    mkdirSync(dir, { recursive: true });
    for (const [gate, checks] of this.checks) {
      const status = checks.some((c) => c.status === "fail") ? "fail" : "pass";
      writeFileSync(
        path.join(dir, `${gate}.json`),
        `${JSON.stringify({ gate, status, generatedAt: new Date().toISOString(), checks }, null, 2)}\n`,
      );
    }
  }
}

function gateFromFile(file: string): string {
  const name = path.basename(file);
  if (name.startsWith("routes")) return "G2";
  if (name.startsWith("seo")) return "G4";
  if (name.startsWith("layout")) return "G5";
  if (name.startsWith("a11y")) return "G6";
  if (name.startsWith("perf")) return "G7";
  if (name.startsWith("visual")) return "G8";
  if (name.startsWith("switch")) return "G13";
  return "G0";
}

export default GateReporter;
