import { fileURLToPath } from "node:url";
import { fail, grepLines, listSourceFiles, pass, readText } from "./util.mjs";

const TEXT_EXT = [".ts", ".tsx", ".mts", ".css", ".mjs", ".json", ".md", ".svg"];
const GLASS_ALLOWED = [/^src\/components\/glass\//, /^src\/styles\/materials\.css$/];
const PALETTES =
  "indigo|violet|purple|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|fuchsia|pink|rose";
const COLOR_UTILS =
  "bg|text|border|from|to|via|ring|fill|stroke|outline|decoration|accent|caret|divide|placeholder|shadow";

/* §8 XIV klishelar: ingliz, rus va oʻzbek muqobillari. Roʻyxat docs/qa/anti-slop-checklist.md da ham bor. */
export const CLICHES = [
  ["en", "unlock", /\bunlock/i],
  ["en", "elevate", /\belevat(?:e|es|ed|ing)\b/i],
  ["en", "seamless", /\bseamless/i],
  ["en", "empower", /\bempower/i],
  ["en", "journey", /\bjourney\b/i],
  ["en", "cutting-edge", /cutting[- ]edge/i],
  ["en", "world-class", /world[- ]class/i],
  ["en", "in today's fast-paced world", /today['’]s fast[- ]paced|fast[- ]paced world/i],
  [
    "en",
    "game-changer, next level, revolutionize, supercharge, delve, leverage, synergy",
    /game[- ]chang|next[- ]level|revolutioni[sz]|supercharg|\bdelve\b|\bleverag|\bsynerg/i,
  ],
  ["ru", "разблокируйте, откройте для себя", /разблокир|откройте для себя/i],
  ["ru", "на новый уровень", /на новый уровень/i],
  ["ru", "бесшовный", /бесшовн/i],
  ["ru", "расширяем возможности", /расшир\S* возможност/i],
  [
    "ru",
    "ваше путешествие, путешествие в мир",
    /ваше путешествие|путешествие в мир|творческое путешествие/i,
  ],
  ["ru", "передовой", /\bпередов(?:ой|ые|ая|ых|ым)\b/i],
  ["ru", "мирового класса/уровня", /мирового (?:класса|уровня)/i],
  ["ru", "в современном быстро меняющемся мире", /быстро меняющемся мире|в наше динамичное время/i],
  ["uz", "kashf eting", /kashf eting/i],
  ["uz", "yangi bosqichga olib chiqing", /yangi (?:bosqich|daraja)ga (?:olib chiq|koʻtar)/i],
  ["uz", "uzluksiz/muammosiz tajriba", /(?:uzluksiz|muammosiz|silliq) tajriba/i],
  ["uz", "imkoniyatlaringizni oching", /imkoniyatlar\S* (?:oching|kengaytir)/i],
  ["uz", "ijodiy sayohat, sayohatingiz", /ijodiy sayohat|sayohatingiz|sayohatga chorla/i],
  ["uz", "ilgʻor texnologiya", /ilgʻor texnologiya/i],
  ["uz", "jahon/dunyo darajasida", /(?:jahon|dunyo) darajasi/i],
  ["uz", "shiddatli dunyoda", /shiddatli dunyo|tez oʻzgarayotgan dunyo/i],
];

/** CSS blokining ichida `!important` faqat reduced-motion va [hidden] uchun qoladi. */
function importantAllowed(text, hit) {
  const offset = text
    .split("\n")
    .slice(0, hit.line - 1)
    .join("\n").length;
  const selectors = [];
  let depth = 0;
  for (let i = offset; i >= 0; i--) {
    const ch = text[i];
    if (ch === "}") depth++;
    else if (ch === "{") {
      if (depth > 0) depth--;
      else {
        const start = Math.max(
          text.lastIndexOf("{", i - 1),
          text.lastIndexOf("}", i - 1),
          text.lastIndexOf(";", i - 1),
        );
        selectors.push(text.slice(start + 1, i).trim());
      }
    }
  }
  const innermost = selectors[0] ?? "";
  return selectors.some((s) => /prefers-reduced-motion/.test(s)) || /^\[hidden\]$/.test(innermost);
}

const RULES = [
  { id: "gradient-text", re: /bg-clip-text|background-clip:\s*text/ },
  {
    id: "backdrop-filter",
    re: /backdrop-filter/,
    allow: (file) => GLASS_ALLOWED.some((re) => re.test(file)),
  },
  {
    id: "palette",
    re: new RegExp(`(?<![\\w-])(?:[\\w-]+:)*(?:${COLOR_UTILS})-(?:${PALETTES})-\\d{2,3}(?![\\w-])`),
  },
  { id: "emoji", re: /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u },
  { id: "transition-all", re: /transition-all|transition:\s*all\b/ },
  { id: "important", re: /!important/, allow: (file, hit, text) => importantAllowed(text, hit) },
  {
    id: "z-index",
    re: /(?<![\w-])-?z-\d+(?![\w-])|zIndex:\s*-?\d+|z-index:\s*-?\d+/,
    /* CSS da -1/0/1 izolyatsiyalangan komponent ichidagi mahalliy qatlam; sahifa qatlamlari faqat token. */
    allow: (file, hit) => file.endsWith(".css") && /z-index:\s*(?:-1|0|1)\b/.test(hit.match),
  },
  { id: "dead-link", re: /href\s*[:=]\s*["'`]#["'`]/ },
  { id: "lorem", re: /\blorem\b/i },
  {
    id: "coming-soon",
    re: /coming soon|скоро (?:здесь|появится|будет)|tez (?:kunda|orada) (?:bu yerda|paydo)/i,
  },
  { id: "eyebrow", re: /\b(?:eyebrow|kicker)\b/i },
  { id: "trusted-by", re: /trusted by|нам доверяют|bizga ishon(?:adi|ishadi)|бизга ишон/i },
  {
    id: "capsule-badge",
    re: /rounded-full/,
    allow: (file, hit) => !/badge|\btag\b|chip|pill/i.test(hit.text),
  },
  { id: "left-border-card", re: /(?<![\w-])(?:[\w-]+:)*border-[ls]-[2-8](?![\w-])/ },
  ...CLICHES.map(([lang, label, re]) => ({ id: `cliche:${lang}:${label}`, re })),
];

export function scanAntiSlop(files = listSourceFiles(TEXT_EXT)) {
  const texts = new Map(files.map((file) => [file, readText(file)]));
  const checks = [];
  for (const rule of RULES) {
    const hits = [];
    for (const [file, text] of texts) {
      for (const hit of grepLines(file, rule.re, text)) {
        if (rule.allow && rule.allow(file, hit, text)) continue;
        hits.push(`${file}:${hit.line}: ${hit.text.slice(0, 100)}`);
      }
    }
    const id = `anti-slop:${rule.id}`;
    checks.push(
      hits.length
        ? fail(id, hits.slice(0, 8).join("\n") + (hits.length > 8 ? `\n… jami ${hits.length}` : ""))
        : pass(id),
    );
  }
  return checks;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const checks = scanAntiSlop();
  for (const c of checks)
    console.log(
      `${c.status.padEnd(4)} ${c.id}${c.detail ? "\n  " + c.detail.replace(/\n/g, "\n  ") : ""}`,
    );
  process.exit(checks.some((c) => c.status === "fail") ? 1 : 0);
}
