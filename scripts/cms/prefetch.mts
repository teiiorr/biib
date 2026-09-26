/**
 * Yigʻishdan oldin kontentni bir marta oladi: `pnpm build` shu skriptdan keyin
 * CMS_BUILD_PIN=.content-cache/snapshot.json bilan next build ni ishga tushiradi. Shunda hamma sahifa
 * (va yigʻish ishchilari) tarmoqsiz, aynan bitta nusxadan yigʻiladi.
 *
 * CONTENT_SOURCE=supabase boʻlmasa hech narsa qilmaydi (sayt repodagi snapshot.json dan yigʻiladi).
 * Baza javob bermasa: CMS_BUILD_FALLBACK=fail (Vercel production da standart) yigʻishni toʻxtatadi,
 * oldingi deploy ishlab turaveradi; aks holda repodagi nusxa ogohlantirish bilan ishlatiladi.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import { bundledSnapshot } from "../../src/content/bundled";
import { fetchSnapshot } from "./rest.mts";

const PIN = path.resolve(".content-cache/snapshot.json");

function fallbackPolicy(): "fail" | "bundled" {
  const value = process.env.CMS_BUILD_FALLBACK?.trim();
  if (value === "fail" || value === "bundled") return value;
  if (value) throw new Error(`CMS_BUILD_FALLBACK notoʻgʻri: «${value}» (fail yoki bundled)`);
  return process.env.VERCEL_ENV === "production" ? "fail" : "bundled";
}

function writePin(data: unknown): void {
  mkdirSync(path.dirname(PIN), { recursive: true });
  writeFileSync(PIN, JSON.stringify(data));
}

/* Eski yigʻishdan qolgan nusxa hech qachon oʻqilmasin. */
rmSync(PIN, { force: true });
const source = process.env.CONTENT_SOURCE?.trim() || "bundled";

if (source === "supabase") {
  const policy = fallbackPolicy();
  try {
    const snapshot = await fetchSnapshot(20_000);
    writePin(snapshot);
    process.stdout.write(
      `Kontent bazadan olindi: ${snapshot.news.length} yangilik → ${path.relative(process.cwd(), PIN)}\n`,
    );
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    if (policy === "fail") {
      process.stderr.write(
        `Kontent bazadan olinmadi, yigʻish toʻxtatildi (oldingi deploy ishlab turibdi).\n${reason}\n` +
          "Favqulodda holatda CMS_BUILD_FALLBACK=bundled bilan qayta deploy qiling.\n",
      );
      process.exit(1);
    }
    writePin(bundledSnapshot());
    process.stderr.write(
      `Ogohlantirish: kontent bazadan olinmadi, repodagi snapshot.json ishlatiladi.\n${reason}\n`,
    );
  }
} else if (source !== "bundled") {
  process.stderr.write(`CONTENT_SOURCE notoʻgʻri: «${source}» (bundled yoki supabase)\n`);
  process.exit(1);
}
