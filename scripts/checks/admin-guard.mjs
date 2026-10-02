import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, fail, pass } from "./util.mjs";

const ACTIONS = "src/lib/admin/actions";
const PANEL = "src/app/admin/(panel)";
/* Kirish oqimining oʻzi (kirish, chiqish, sessiyani uzaytirish) himoyadan oldin ishlaydi. */
const AUTH_ACTIONS = new Set(["auth.ts"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

/**
 * Panel layout fayli yoʻnaltirmaydi, shuning uchun har bir sahifa requireAdmin, har bir server amali esa
 * birinchi qatorda requireAdminAction chaqiruviga ega boʻlishi shart. Bitta unutilgan tekshiruv begonaga yoʻl ochadi.
 */
export function checkAdminGuards() {
  const problems = [];
  for (const file of walk(path.join(ROOT, ACTIONS)).filter((f) => f.endsWith(".ts"))) {
    if (AUTH_ACTIONS.has(path.basename(file))) continue;
    const source = readFileSync(file, "utf8");
    const exported = /export async function (\w+)\([^]*?\)[^{]*\{\s*([^;]*;)/g;
    let match;
    while ((match = exported.exec(source))) {
      if (!match[2].includes("requireAdminAction(")) {
        problems.push(
          `${path.relative(ROOT, file)}: ${match[1]} requireAdminAction bilan boshlanmaydi`,
        );
      }
    }
  }
  for (const file of walk(path.join(ROOT, PANEL)).filter((f) => f.endsWith("page.tsx"))) {
    if (!readFileSync(file, "utf8").includes("requireAdmin(")) {
      problems.push(`${path.relative(ROOT, file)}: requireAdmin chaqirilmaydi`);
    }
  }
  return [
    problems.length
      ? fail("admin:guards", problems.join("\n"))
      : pass("admin:guards", "sahifalar va amallar himoyalangan"),
  ];
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  for (const c of checkAdminGuards()) console.log(`${c.status} ${c.id}: ${c.detail ?? ""}`);
}
