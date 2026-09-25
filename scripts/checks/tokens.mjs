import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, fail, pass, readText } from "./util.mjs";

/* Atlas tokenlari: mavzusiz :root va ikki mavzu bloki. */
export const TOKEN_FILE = "src/styles/designs/atlas.css";
export const THEMES = ["light", "dark"];

/** :root va :root[data-theme] bloklaridagi --nom: qiymat juftliklari; base = mavzusiz blok. */
export function parseTokenScopes(file = TOKEN_FILE) {
  const css = readText(file).replace(/\/\*[\s\S]*?\*\//g, "");
  const scopes = { base: {}, light: {}, dark: {} };
  const block = /:root(?:\[data-theme="(\w+)"\])?\s*\{([^}]*)\}/g;
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

const list = (names) => names.map((n) => "--" + n).join(", ");

/** Kunduz va tun bir xil token nomlarini belgilaydi; mavzusiz tokenlar mavzu blokida takrorlanmaydi. */
export function checkTokenParity() {
  if (!existsSync(path.join(ROOT, TOKEN_FILE))) return [fail("tokens:file", `${TOKEN_FILE} yoʻq`)];
  const checks = [];
  const css = readText(TOKEN_FILE);
  /* Tokenlar faqat :root va :root[data-theme] da: data-design kabi ortiqcha atribut bloklarni koʻrinmas qiladi. */
  checks.push(
    /data-design/.test(css)
      ? fail("tokens:selectors", `${TOKEN_FILE} da data-design selektori qolgan`)
      : pass("tokens:selectors"),
  );
  const scopes = parseTokenScopes(TOKEN_FILE);
  const empty = ["base", ...THEMES].filter((s) => !Object.keys(scopes[s] ?? {}).length);
  checks.push(
    empty.length
      ? fail("tokens:scopes", `boʻsh yoki topilmagan blok: ${empty.join(", ")}`)
      : pass(
          "tokens:scopes",
          ["base", ...THEMES].map((s) => `${s} ${Object.keys(scopes[s]).length}`).join(", "),
        ),
  );
  const extra = Object.keys(scopes).filter((s) => s !== "base" && !THEMES.includes(s));
  if (extra.length) checks.push(fail("tokens:themes", `nomaʼlum mavzu bloki: ${extra.join(", ")}`));

  const light = new Set(Object.keys(scopes.light ?? {}));
  const dark = new Set(Object.keys(scopes.dark ?? {}));
  const onlyLight = [...light].filter((n) => !dark.has(n));
  const onlyDark = [...dark].filter((n) => !light.has(n));
  if (!onlyLight.length && !onlyDark.length) checks.push(pass("tokens:parity", `${light.size} ta`));
  else {
    const lines = [];
    if (onlyLight.length) lines.push(`faqat kunduz blokida: ${list(onlyLight)}`);
    if (onlyDark.length) lines.push(`faqat tun blokida: ${list(onlyDark)}`);
    checks.push(fail("tokens:parity", lines.join("\n")));
  }

  const base = new Set(Object.keys(scopes.base ?? {}));
  const shadowed = [...new Set([...light, ...dark])].filter((n) => base.has(n));
  checks.push(
    shadowed.length
      ? fail("tokens:overlap", `mavzusiz va mavzu blokida ikki marta: ${list(shadowed)}`)
      : pass("tokens:overlap"),
  );
  return checks;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const checks = checkTokenParity();
  for (const c of checks) console.log(`${c.status.padEnd(4)} ${c.id}: ${c.detail ?? ""}`);
  process.exit(checks.some((c) => c.status === "fail") ? 1 : 0);
}
