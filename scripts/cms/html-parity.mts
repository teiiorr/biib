/**
 * Kontent manbai almashganda ommaviy sahifalar oʻzgarmaganini tekshiradi.
 *
 *   pnpm exec tsx scripts/cms/html-parity.mts fetch <papka> [--base http://localhost:3200]
 *   pnpm exec tsx scripts/cms/html-parity.mts diff <oldingi> <keyingi>
 *
 * Manzillar ishlab turgan serverning sitemap.xml faylidan olinadi, shuning uchun skript kod holatiga
 * bogʻliq emas. Yigʻishga xos izlar olib tashlanadi, qolgan har bir farq xato hisoblanadi.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const PARTS = ["head", "main", "body", "data", "og"] as const;
type Part = (typeof PARTS)[number];

/* Nomaʼlum yoʻllar ham bir xil 404 berishi kerak: shakli toʻgʻri slug, notoʻgʻri slug, notoʻgʻri til. */
const PROBES = [
  "/uz/yoq-sahifa",
  "/ru/novosti/nomalum-maqola",
  "/en/news/Bad_Slug",
  "/oz/yangiliklar/yoq",
  "/xx",
];

function arg(name: string, fallback: string): string {
  const index = process.argv.indexOf(name);
  return index > 0 ? (process.argv[index + 1] ?? fallback) : fallback;
}

function routeId(pathname: string): string {
  return pathname.replace(/^\/+/, "").replace(/[/?=&]+/g, "_") || "root";
}

/* OG manzilidagi xesh rasm faylining manba kodidan olinadi, shuning uchun u ham tashlanadi;
   rasmning oʻzi alohida xesh bilan solishtiriladi. */
function normalize(text: string): string {
  return text
    .replace(/(\/opengraph-image(?:\/[A-Za-z0-9_-]+)?)\?[0-9a-f]{16}\b/g, "$1?<hash>")
    .replace(/\/_next\/static\/chunks\/[^"'\s)>,]+/g, "/_next/static/chunks/<chunk>")
    .replace(
      /\/_next\/static\/(?!chunks\/|media\/|css\/)[A-Za-z0-9_-]{8,}\//g,
      "/_next/static/<build>/",
    )
    .replace(/\/_next\/static\/css\/[^"'\s)>,]+/g, "/_next/static/css/<css>")
    .replace(/[?&]dpl=[A-Za-z0-9_-]+/g, "");
}

function stripScripts(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
}

function textOf(html: string): string {
  return stripScripts(html)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, "")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headTags(html: string): string {
  const head = /<head\b[^>]*>([\s\S]*?)<\/head>/.exec(html)?.[1] ?? "";
  const tags = head.match(/<title\b[^>]*>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*>/g) ?? [];
  /* Skript oldindan yuklash roʻyxati JS boʻlaklariga bogʻliq, kontentga emas. */
  return tags
    .filter((tag) => !/\bas="script"/.test(tag))
    .map(normalize)
    .join("\n");
}

function dataBlocks(html: string): string {
  const blocks = html.match(
    /<script\b[^>]*type="application\/(?:ld\+)?json"[^>]*>[\s\S]*?<\/script>/g,
  );
  return (blocks ?? []).map(normalize).join("\n");
}

function sitemapNormalized(xml: string): string {
  /* Tasdiqlangan loyiha sanasi yigʻish vaqtidan olinadi, shuning uchun yarim tun boʻlmagan vaqt «hozir» deb olinadi. */
  return xml.replace(
    /<lastmod>(\d{4}-\d{2}-\d{2}T(?!00:00:00\.000Z)[^<]+)<\/lastmod>/g,
    "<lastmod><build-time></lastmod>",
  );
}

async function get(url: string): Promise<{ status: number; body: Buffer }> {
  const response = await fetch(url, { redirect: "manual" });
  return { status: response.status, body: Buffer.from(await response.arrayBuffer()) };
}

async function snapshotPage(
  base: string,
  pathname: string,
  out: string,
): Promise<Record<Part, string>> {
  const { status, body } = await get(`${base}${pathname}`);
  const html = body.toString("utf8");
  /* Xom HTML qoʻlda koʻrish uchun saqlanadi, solishtirilmaydi. */
  writeFileSync(path.join(out, `${routeId(pathname)}.raw.html`), html);
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(html)?.[1] ?? "";
  const bodyHtml = /<body\b[^>]*>([\s\S]*)<\/body>/.exec(html)?.[1] ?? "";
  const ogUrl = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
  let og = "yoʻq";
  if (ogUrl) {
    const target = new URL(ogUrl);
    const image = await get(`${base}${target.pathname}${target.search}`);
    og = `${image.status} ${createHash("sha256").update(image.body).digest("hex")}`;
  }
  return {
    head: `status ${status}\n${headTags(html)}`,
    main: textOf(main),
    body: normalize(stripScripts(bodyHtml)),
    data: dataBlocks(html),
    og,
  };
}

async function fetchAll(out: string, base: string): Promise<void> {
  mkdirSync(out, { recursive: true });
  const sitemap = await get(`${base}/sitemap.xml`);
  const xml = sitemap.body.toString("utf8");
  writeFileSync(path.join(out, "_sitemap.xml"), sitemapNormalized(xml));
  const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1] ?? "").pathname);
  const all = [...pages, ...PROBES];
  /* Bir vaqtda sakkiztadan olinadi, aks holda server va OG chizish ortiqcha yuklanadi. */
  let cursor = 0;
  const worker = async (): Promise<void> => {
    while (cursor < all.length) {
      const pathname = all[cursor++];
      if (!pathname) continue;
      const parts = await snapshotPage(base, pathname, out);
      for (const part of PARTS)
        writeFileSync(path.join(out, `${routeId(pathname)}.${part}.txt`), `${parts[part]}\n`);
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));
  writeFileSync(path.join(out, "_urls.txt"), `${all.join("\n")}\n`);
  process.stdout.write(
    `${pages.length} sahifa (sitemap) + ${PROBES.length} 404 namunasi → ${out}\n`,
  );
}

function firstDifference(a: string, b: string): string {
  const left = a.split("\n");
  const right = b.split("\n");
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    if (left[i] !== right[i])
      return `  ${i + 1}-qator\n  - ${(left[i] ?? "").slice(0, 300)}\n  + ${(right[i] ?? "").slice(0, 300)}`;
  }
  return "";
}

function diffAll(before: string, after: string): number {
  const names = new Set([...readdirSync(before), ...readdirSync(after)]);
  const counts: Record<string, number> = {};
  const report: string[] = [];
  for (const name of [...names].sort()) {
    if (name.endsWith(".raw.html")) continue;
    const a = path.join(before, name);
    const b = path.join(after, name);
    const kind = name.startsWith("_") ? name : (name.split(".").at(-2) ?? name);
    if (!existsSync(a) || !existsSync(b)) {
      counts[kind] = (counts[kind] ?? 0) + 1;
      report.push(`${name}: ${existsSync(a) ? "keyingisida yoʻq" : "oldingisida yoʻq"}`);
      continue;
    }
    const left = readFileSync(a, "utf8");
    const right = readFileSync(b, "utf8");
    if (left === right) continue;
    counts[kind] = (counts[kind] ?? 0) + 1;
    report.push(`${name}\n${firstDifference(left, right)}`);
  }
  const urls = readFileSync(path.join(after, "_urls.txt"), "utf8").trim().split("\n").length;
  process.stdout.write(`${urls} manzil solishtirildi.\n`);
  if (!report.length) {
    process.stdout.write("Farq yoʻq.\n");
    return 0;
  }
  process.stdout.write(`Farqlar: ${JSON.stringify(counts)}\n${report.slice(0, 40).join("\n")}\n`);
  return 1;
}

const [mode, first, second] = process.argv.slice(2);
if (mode === "fetch" && first) {
  await fetchAll(path.resolve(first), arg("--base", "http://localhost:3200"));
} else if (mode === "diff" && first && second) {
  process.exitCode = diffAll(path.resolve(first), path.resolve(second));
} else {
  process.stderr.write("Foydalanish: html-parity.mts fetch <papka> [--base URL] | diff <a> <b>\n");
  process.exitCode = 2;
}
