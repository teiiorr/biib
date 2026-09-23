import { spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { BASE_URL, ROOT, VERIFY_DIR, log, logRaw, readJson, run, writeJson } from "./util.mjs";

const PID_FILE = path.join(VERIFY_DIR, "server.json");
const PORTS = [3000, 3100];

export function listeners(port) {
  const result = run("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"]);
  return result.stdout.split("\n").slice(1).filter(Boolean);
}

/** Begona server ishlayotgan boʻlsa toʻliq tekshiruv boshlanmaydi; oʻz qoldigʻimiz oʻchiriladi. */
export function assertPortsFree() {
  const own = existsSync(PID_FILE) ? readJson(".verify/server.json", null) : null;
  for (const port of PORTS) {
    const lines = listeners(port);
    if (!lines.length) continue;
    const pids = lines.map((line) => Number(line.split(/\s+/)[1]));
    if (own && port === own.port && pids.includes(own.pid)) {
      log(`3100 portda oldingi ishga tushirishning serveri (pid ${own.pid}) toʻxtatilmoqda`);
      try {
        process.kill(-own.pid, "SIGTERM");
      } catch {
        /* jarayon allaqachon yoʻq */
      }
      continue;
    }
    throw new Error(
      `${port} portda server ishlayapti; --full undan oldin toʻxtating:\n${lines.join("\n")}`,
    );
  }
}

async function waitForServer(timeoutMs) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${BASE_URL}/uz`, { redirect: "manual" });
      if (response.status < 500) return true;
    } catch {
      /* hali koʻtarilmagan */
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

export async function startServer() {
  log("pnpm start (3100)");
  const child = spawn("pnpm", ["start"], {
    cwd: ROOT,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, FORCE_COLOR: "0", NEXT_TELEMETRY_DISABLED: "1" },
  });
  child.stdout.on("data", (chunk) => logRaw(`[server] ${chunk}`));
  child.stderr.on("data", (chunk) => logRaw(`[server] ${chunk}`));
  writeJson(".verify/server.json", { pid: child.pid, port: 3100 });
  const ready = await waitForServer(120_000);
  if (!ready) {
    await stopServer(child);
    throw new Error("3100 portdagi server 120 s ichida javob bermadi");
  }
  log("server tayyor");
  return child;
}

export async function stopServer(child) {
  if (!child) return;
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    /* allaqachon toʻxtagan */
  }
  await new Promise((resolve) => setTimeout(resolve, 1500));
  try {
    process.kill(-child.pid, "SIGKILL");
  } catch {
    /* toza chiqdi */
  }
  rmSync(PID_FILE, { force: true });
  log("server toʻxtatildi");
}
