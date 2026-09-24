// Koʻrik toʻplami (§21.5): sahifalar, 2x kesmalar, portal sahnasi va aloqa varaqlari docs/qa/shots/ ga.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3100";
const DESIGNS = (process.env.DESIGN ?? "atlas")
  .split(/[,\s]+/)
  .filter((d) => d === "atlas" || d === "birlashma");
const OUT = path.resolve("docs/qa/shots");
const SECTIONS = {
  uz: {
    about: "biz-haqimizda",
    projects: "loyihalar",
    news: "yangiliklar",
    experts: "ekspertlar-kengashi",
    leadership: "rahbariyat",
    partners: "hamkorlar",
    contacts: "aloqa",
    privacy: "maxfiylik",
  },
  ru: {
    about: "o-nas",
    projects: "proekty",
    news: "novosti",
    experts: "ekspertnyy-sovet",
    leadership: "rukovodstvo",
    partners: "partnery",
    contacts: "kontakty",
    privacy: "konfidentsialnost",
  },
};
const SLUG = "upop-trend-yangi-mavsum";
const PAGES = [
  "home",
  "about",
  "projects",
  "news",
  "newsItem",
  "experts",
  "leadership",
  "partners",
  "contacts",
  "privacy",
  "notFound",
];
const VIEWPORTS = [
  { name: "390", width: 390, height: 844, mobile: true },
  { name: "1440", width: 1440, height: 900, mobile: false },
];
const CROPS = [
  ["header", '[data-testid="header"]'],
  ["tab-bar", '[data-testid="tab-bar"]'],
  ["button-primary", '[data-variant="primary"]'],
  ["button-glass", '[data-variant="glass"]'],
  ["card-group", "[data-card-group]"],
  ["footer-crown", '[data-testid="footer-crown"]'],
];

function pagePath(locale, page) {
  const s = SECTIONS[locale];
  if (page === "home") return `/${locale}`;
  if (page === "notFound") return `/${locale}/yoq-sahifa`;
  if (page === "newsItem") return `/${locale}/${s.news}/${SLUG}`;
  return `/${locale}/${s[page]}`;
}

async function prime(context, appearance) {
  await context.addInitScript((value) => {
    try {
      localStorage.setItem("biib:appearance", JSON.stringify(value));
    } catch {}
  }, appearance);
}

async function contactSheet(files, target) {
  const tiles = [];
  for (const file of files) {
    try {
      tiles.push(
        await sharp(file)
          .resize({ width: 480, height: 480, fit: "inside", background: "#fff" })
          .png()
          .toBuffer(),
      );
    } catch {}
  }
  if (!tiles.length) return;
  const cols = Math.min(4, tiles.length);
  const rows = Math.ceil(tiles.length / cols);
  const metas = await Promise.all(tiles.map((t) => sharp(t).metadata()));
  const composite = tiles.map((input, i) => ({
    input,
    left: (i % cols) * 500 + 10,
    top: Math.floor(i / cols) * 500 + 10,
  }));
  await sharp({
    create: { width: cols * 500, height: rows * 500, channels: 3, background: "#f2f2f2" },
  })
    .composite(
      composite.map((c, i) => ({
        ...c,
        top: c.top + Math.floor((480 - (metas[i].height ?? 480)) / 2),
      })),
    )
    .png()
    .toFile(target);
}

/* Bir (dizayn, mavzu, til, oʻlcham) uchun bitta kontekst va bitta varaq: sahifalar ketma-ket,
   kombinatsiyalar 4 tadan parallel. networkidle oʻrniga load + qisqa kutish. */
const browser = await chromium.launch({ channel: "chromium" });
const index = [];
const filesByDir = new Map();

async function shootCombo(design, theme, locale, vp) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  await prime(context, {
    design,
    theme,
    transparency: 50,
    density: 50,
    motion: false,
    sound: false,
  });
  const tab = await context.newPage();
  for (const page of PAGES) {
    const dir = path.join(OUT, design, theme, locale, page);
    mkdirSync(dir, { recursive: true });
    const cropDir = path.join(dir, "crops");
    mkdirSync(cropDir, { recursive: true });
    await tab
      .goto(`${BASE_URL}${pagePath(locale, page)}`, { waitUntil: "load" })
      .catch(() => undefined);
    await tab.waitForTimeout(700);
    const view = path.join(dir, `${vp.name}-viewport.png`);
    const full = path.join(dir, `${vp.name}-full.png`);
    await tab.screenshot({ path: view }).catch(() => undefined);
    await tab.screenshot({ path: full, fullPage: true }).catch(() => undefined);
    const list = filesByDir.get(dir) ?? [];
    list.push(view);
    filesByDir.set(dir, list);
    for (const [name, selector] of CROPS) {
      const el = tab.locator(selector).first();
      if (await el.count()) {
        await el
          .screenshot({ path: path.join(cropDir, `${vp.name}-${name}.png`) })
          .catch(() => undefined);
      }
    }
    if (page === "home") {
      const openBtn = tab.getByTestId("appearance-open").locator("visible=true").first();
      for (const [t, d] of [
        [0, 50],
        [100, 50],
      ]) {
        await tab.evaluate(
          ([tt, dd]) => {
            document.documentElement.style.setProperty("--g-t", String(tt / 100));
            document.documentElement.style.setProperty("--g-d", String(dd / 100));
          },
          [t, d],
        );
        await openBtn.click({ timeout: 3000 }).catch(() => undefined);
        const panel = tab.getByTestId("appearance-panel").first();
        await panel.waitFor({ state: "visible", timeout: 3000 }).catch(() => undefined);
        if (await panel.count())
          await panel
            .screenshot({ path: path.join(cropDir, `${vp.name}-panel-t${t}.png`) })
            .catch(() => undefined);
        await tab.keyboard.press("Escape");
        await tab.waitForTimeout(200);
      }
      const portal = tab.getByTestId("portal-scene").first();
      if (await portal.count()) {
        const box = await portal.boundingBox();
        const scrollY = await tab.evaluate(() => window.scrollY);
        if (box) {
          for (const p of [0, 50, 100]) {
            await tab.evaluate(
              ([top, h, pct]) => window.scrollTo(0, top + (h * pct) / 100),
              [box.y + scrollY, box.height, p],
            );
            await tab.waitForTimeout(300);
            await tab
              .screenshot({ path: path.join(cropDir, `${vp.name}-portal-${p}.png`) })
              .catch(() => undefined);
          }
        }
      }
    }
  }
  await context.close();
}

const combos = [];
for (const design of DESIGNS)
  for (const theme of ["light", "dark"])
    for (const locale of ["uz", "ru"])
      for (const vp of VIEWPORTS) combos.push([design, theme, locale, vp]);
const POOL = 4;
let cursor = 0;
await Promise.all(
  Array.from({ length: POOL }, async () => {
    while (cursor < combos.length) {
      const combo = combos[cursor++];
      await shootCombo(...combo);
    }
  }),
);
await browser.close();
for (const [dir, files] of filesByDir) {
  await contactSheet(files, path.join(dir, "contact-sheet.png"));
  index.push(`- ${path.relative(OUT, dir)}: ${files.map((f) => path.relative(OUT, f)).join(", ")}`);
}
mkdirSync(OUT, { recursive: true });
writeFileSync(path.join(OUT, "index.md"), `# Koʻrik toʻplami\n\n${index.sort().join("\n")}\n`);
console.log(`shots: ${index.length} sahifa`);
