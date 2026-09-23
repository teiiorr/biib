import { existsSync } from "node:fs";
import path from "node:path";
import { ROOT, fail, log, pass, readJson, runLive, tail } from "./util.mjs";

const LOCALE_PATH = /^\/(uz|oz|ozbekca|ru|en)(?:\/|$)/;
const METADATA_FILE =
  /\/(?:opengraph-image|twitter-image|icon|apple-icon)(?:-[\w]+)?(?:\.\w+)?$|\.(?:xml|txt|webmanifest|png|ico)$/;
/* Faqat 404 zaxirasi dinamik boʻlishi mumkin; aloqa shakli server action, marshrut emas. */
const ALLOWED_DYNAMIC = /^\/(?:_not-found|_global-not-found|global-not-found)$|\[|not-found/;

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

export async function runBuild(ctx) {
  log("G1: pnpm build");
  const result = await runLive("pnpm", ["build"], {
    timeout: 25 * 60_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
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
  return checks;
}
