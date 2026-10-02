/**
 * Bazadagi kontentni content_snapshot() orqali src/content/snapshot.json fayliga tortadi.
 * Bu fayl saytning zaxira manbai va til tekshiruvining matn korpusi.
 *
 *   pnpm content:pull           faylni yangilaydi (prettier bilan)
 *   pnpm content:pull --check   hech narsa yozmaydi, baza nusxadan farq qilsa 1 bilan chiqadi
 *
 * Ommaviy sahifalar bilan bir xil yoʻl ishlatiladi: publishable kalit va bitta RPC.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { format, resolveConfig } from "prettier";

import { bundledSnapshot } from "../../src/content/bundled";
import type { ContentSnapshot } from "../../src/content/snapshot";
import { fetchSnapshot } from "./rest.mts";

const TARGET = path.resolve("src/content/snapshot.json");
/* Bu qismlar repodagi eski nusxada yoʻq edi, shuning uchun faqat kontent solishtiriladi. */
const IGNORED = new Set<string>(["media", "redirects", "texts", "allowWords"]);

function show(value: unknown): string {
  const text = JSON.stringify(value);
  return text === undefined ? "(yoʻq)" : text.length > 120 ? `${text.slice(0, 117)}…` : text;
}

/** Har bir farq yoʻli bilan yoziladi (news[0].title.ru); kalitlar tartibi hisobga olinmaydi. */
function differences(left: unknown, right: unknown, at: string, out: string[]): void {
  if (Object.is(left, right)) return;
  const bothArrays = Array.isArray(left) && Array.isArray(right);
  const bothObjects =
    typeof left === "object" &&
    typeof right === "object" &&
    left !== null &&
    right !== null &&
    !Array.isArray(left) &&
    !Array.isArray(right);
  if (bothArrays) {
    if (left.length !== right.length) out.push(`${at}: uzunlik ${left.length} ≠ ${right.length}`);
    for (let i = 0; i < Math.min(left.length, right.length); i++)
      differences(left[i], right[i], `${at}[${i}]`, out);
    return;
  }
  if (bothObjects) {
    const a = left as Record<string, unknown>;
    const b = right as Record<string, unknown>;
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)]))
      differences(a[key], b[key], at ? `${at}.${key}` : key, out);
    return;
  }
  out.push(`${at}: repo ${show(left)} ≠ baza ${show(right)}`);
}

function contentOnly(s: ContentSnapshot): Record<string, unknown> {
  return Object.fromEntries(Object.entries(s).filter(([key]) => !IGNORED.has(key)));
}

const remote = await fetchSnapshot();

if (process.argv.includes("--check")) {
  const diff: string[] = [];
  differences(contentOnly(bundledSnapshot()), contentOnly(remote), "", diff);
  if (diff.length) {
    process.stderr.write(
      `Baza repodagi nusxadan farq qiladi (${diff.length}):\n  ${diff.slice(0, 60).join("\n  ")}\n`,
    );
    process.exitCode = 1;
  } else {
    process.stdout.write("Baza va repodagi nusxa bir xil.\n");
  }
} else {
  const options = (await resolveConfig(TARGET)) ?? {};
  writeFileSync(TARGET, await format(JSON.stringify(remote), { ...options, parser: "json" }));
  process.stdout.write(
    `${path.relative(process.cwd(), TARGET)}: ${remote.news.length} yangilik, ` +
      `${remote.leadership.length + remote.experts.length} kishi, ` +
      `${Object.keys(remote.media).length} yuklangan rasm.\n`,
  );
}
