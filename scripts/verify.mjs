#!/usr/bin/env node
import { computeTreeHash } from "./checks/tree-hash.mjs";
import { ROOT } from "./checks/util.mjs";

const USAGE = `node scripts/verify.mjs --quick | --full | --prod | --tree-hash
  --quick      G0 statik, G3 til, G11 gigiyena (state.json yozilmaydi)
  --full       yigʻish, 3100 portda ishga tushirish, G0–G11 (yagona dizayn: Atlas)
  --prod       G12: ishlab chiqarish manzili boʻyicha tekshiruv
  --tree-hash  daraxt xeshi (faqat xesh chiqadi)`;

process.chdir(ROOT);
const mode = process.argv[2];

if (mode === "--tree-hash") {
  process.stdout.write(computeTreeHash() + "\n");
  process.exit(0);
}

const runners = { "--quick": "runQuick", "--full": "runFull", "--prod": "runProd" };
const runner = runners[mode];
if (!runner) {
  console.error(USAGE);
  process.exit(2);
}

const gates = await import("./checks/gates.mjs");
try {
  const ok = await gates[runner]();
  process.exit(ok ? 0 : 1);
} catch (error) {
  console.error(
    "verify: " + (error instanceof Error ? (error.stack ?? error.message) : String(error)),
  );
  process.exit(1);
}
