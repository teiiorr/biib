import { fileURLToPath } from "node:url";
import { fail, pass, readText } from "./util.mjs";

export const DESIGN_FILES = {
  atlas: "src/styles/designs/atlas.css",
  birlashma: "src/styles/designs/birlashma.css",
};

/** :root[data-design][data-theme] bloklaridagi --nom: qiymat juftliklari; base = mavzusiz blok. */
export function parseTokenScopes(file) {
  const css = readText(file).replace(/\/\*[\s\S]*?\*\//g, "");
  const scopes = { base: {}, light: {}, dark: {} };
  const block = /:root\[data-design="[\w-]+"\](?:\[data-theme="(\w+)"\])?\s*\{([^}]*)\}/g;
  let match;
  while ((match = block.exec(css))) {
    const scope = match[1] ?? "base";
    const target = scopes[scope] ?? (scopes[scope] = {});
    const decl = /--([\w-]+)\s*:\s*([^;]+);/g;
    let d;
    while ((d = decl.exec(match[2]))) target[d[1]] = d[2].replace(/\s+/g, " ").trim();
  }
  return scopes;
}

export function checkTokenParity() {
  const atlas = parseTokenScopes(DESIGN_FILES.atlas);
  const birlashma = parseTokenScopes(DESIGN_FILES.birlashma);
  const checks = [];
  for (const scope of new Set([...Object.keys(atlas), ...Object.keys(birlashma)])) {
    const a = new Set(Object.keys(atlas[scope] ?? {}));
    const b = new Set(Object.keys(birlashma[scope] ?? {}));
    const onlyAtlas = [...a].filter((n) => !b.has(n));
    const onlyBirlashma = [...b].filter((n) => !a.has(n));
    const id = `tokens:parity:${scope}`;
    if (!onlyAtlas.length && !onlyBirlashma.length) {
      checks.push(pass(id, `${a.size} ta token`));
      continue;
    }
    const lines = [];
    if (onlyAtlas.length)
      lines.push(`faqat atlas.css da: ${onlyAtlas.map((n) => "--" + n).join(", ")}`);
    if (onlyBirlashma.length)
      lines.push(`faqat birlashma.css da: ${onlyBirlashma.map((n) => "--" + n).join(", ")}`);
    checks.push(fail(id, lines.join("\n")));
  }
  return checks;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const checks = checkTokenParity();
  for (const c of checks) console.log(`${c.status.padEnd(4)} ${c.id}: ${c.detail ?? ""}`);
  process.exit(checks.some((c) => c.status === "fail") ? 1 : 0);
}
