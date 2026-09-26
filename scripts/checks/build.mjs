import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROOT, VERIFY_ENV, fail, log, pass, readJson, runLive, tail } from "./util.mjs";

const CLIENT_TEXT = /\.(?:js|mjs|css|json|html|txt|map)$/;

const LOCALE_PATH = /^\/(uz|oz|ozbekca|ru|en)(?:\/|$)/;
const METADATA_FILE =
  /\/(?:opengraph-image|twitter-image|icon|apple-icon)(?:-[\w]+)?(?:\.\w+)?$|\.(?:xml|txt|webmanifest|png|ico)$/;
/* Faqat 404 zaxirasi va boshqaruv paneli (/admin, uning Route Handler lari /admin/api da) dinamik boʻlishi
   mumkin; aloqa shakli server action, marshrut emas. */
const ALLOWED_DYNAMIC =
  /^\/(?:_not-found|_global-not-found|global-not-found)$|\[|not-found|^\/admin(?:\/|$)/;

export function parseRouteTable(output) {
  const rows = [];
  for (const line of output.split("\n")) {
    const match = line.match(/^\s*[│├└┌]?\s*([○●◐ƒ])\s+(\/\S*)/u);
    if (match) rows.push({ symbol: match[1], route: match[2] });
  }
  const middleware = /ƒ\s+Proxy|ƒ\s+Middleware/u.test(output);
  return { rows, middleware };
}

export function checkManifest(
  expectedPaths,
  manifest = readJson(".next/prerender-manifest.json", null),
) {
  if (!manifest) return [fail("build:manifest", ".next/prerender-manifest.json yoʻq")];
  const all = Object.keys(manifest.routes ?? {});
  const pages = all.filter((p) => LOCALE_PATH.test(p) && !METADATA_FILE.test(p));
  const service = all.filter((p) => !pages.includes(p));
  const expected = new Set(expectedPaths);
  const hits = [];
  for (const p of expected) if (!pages.includes(p)) hits.push(`oldindan yigʻilmagan: ${p}`);
  for (const p of pages) if (!expected.has(p)) hits.push(`kutilmagan sahifa: ${p}`);
  const summary = `${pages.length} sahifa (${expected.size} kerak), ${service.length} xizmat fayli`;
  if (pages.length !== expected.size) hits.unshift(summary);
  const dynamic = Object.keys(manifest.dynamicRoutes ?? {}).filter((r) => !ALLOWED_DYNAMIC.test(r));
  return [
    hits.length
      ? fail("build:prerendered", hits.slice(0, 12).join("\n"))
      : pass("build:prerendered", summary),
    dynamic.length
      ? fail("build:dynamic-routes", `manifestda dinamik: ${dynamic.join(", ")}`)
      : pass("build:dynamic-routes"),
  ];
}

/* Loyiha ref i Supabase manzilining birinchi boʻlagi; manzil maxfiy emas, .env.local dan faqat shu qator. */
function supabaseProjectRef() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envFile = path.join(ROOT, ".env.local");
  if (!url && existsSync(envFile)) {
    url = /^NEXT_PUBLIC_SUPABASE_URL=["']?([^"'\s]+)/m.exec(readFileSync(envFile, "utf8"))?.[1];
  }
  try {
    return url ? new URL(url).hostname.split(".")[0] || null : null;
  } catch {
    return null;
  }
}

/** Brauzerga ketadigan fayllarda Supabase kaliti, paketi yoki loyiha manzili boʻlmasligi kerak. */
export function checkClientIsolation(ref = supabaseProjectRef()) {
  const dir = path.join(ROOT, ".next/static");
  if (!existsSync(dir)) return fail("build:client-isolation", ".next/static yoʻq");
  const needles = [
    ["sb_publishable_", "publishable kalit"],
    ["@supabase", "@supabase paketi"],
    ...(ref ? [[ref, "loyiha manzili"]] : []),
  ];
  const hits = [];
  let scanned = 0;
  for (const rel of readdirSync(dir, { recursive: true })) {
    const file = path.join(dir, String(rel));
    if (!CLIENT_TEXT.test(file)) continue;
    scanned += 1;
    const text = readFileSync(file, "utf8");
    for (const [needle, label] of needles)
      if (text.includes(needle)) hits.push(`${path.relative(ROOT, file)}: ${label}`);
  }
  return hits.length
    ? fail("build:client-isolation", hits.slice(0, 12).join("\n"))
    : pass(
        "build:client-isolation",
        `${scanned} fayl${ref ? "" : " (manzil nomaʼlum: faqat kalit va paket nomi)"}`,
      );
}

export async function runBuild(ctx) {
  log("G1: pnpm build");
  const result = await runLive("pnpm", ["build"], {
    timeout: 25 * 60_000,
    env: { NEXT_TELEMETRY_DISABLED: "1", ...VERIFY_ENV },
  });
  const checks = [];
  if (result.status !== 0) {
    checks.push(
      fail(
        "build:exit",
        `pnpm build ${result.status}\n${tail(result.stderr || result.stdout, 25)}`,
      ),
    );
    return checks;
  }
  checks.push(pass("build:exit"));
  if (!existsSync(path.join(ROOT, ".next"))) return [fail("build:output", ".next papkasi yoʻq")];
  const table = parseRouteTable(result.stdout + result.stderr);
  const dynamicRows = table.rows.filter((r) => r.symbol === "ƒ" && !ALLOWED_DYNAMIC.test(r.route));
  checks.push(
    dynamicRows.length
      ? fail(
          "build:dynamic",
          `talab boʻyicha render: ${dynamicRows.map((r) => r.route).join(", ")}`,
        )
      : pass("build:dynamic", `${table.rows.length} qator`),
  );
  checks.push(
    table.middleware
      ? fail("build:middleware", "proxy/middleware bor: sahifalar statik boʻlmaydi")
      : pass("build:middleware"),
  );
  checks.push(...checkManifest(ctx.site.routes.map((r) => r.path)));
  checks.push(checkClientIsolation());
  return checks;
}
