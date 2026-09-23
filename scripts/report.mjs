import { formatDuration, writeText } from "./checks/util.mjs";

const LABEL = {
  pass: "oʻtdi",
  fail: "xato",
  skip: "oʻtkazildi",
  warn: "ogohlantirish",
  waived: "istisno",
};
const count = (gate, status) => gate.checks.filter((c) => c.status === status).length;
const firstFailure = (gate) => gate.checks.find((c) => c.status === "fail")?.id ?? "";

/** Terminal uchun ixcham jadval: darvoza, holat, hisob, vaqt, birinchi xato. */
export function formatTable(gates) {
  const rows = gates.map((g) => [
    g.id,
    g.name,
    LABEL[g.status] ?? g.status,
    `${count(g, "pass")}/${count(g, "fail")}/${count(g, "warn") + count(g, "skip") + count(g, "waived")}`,
    formatDuration(g.ms ?? 0),
    firstFailure(g),
  ]);
  const head = ["Darvoza", "Nomi", "Holat", "ok/xato/boshqa", "Vaqt", "Birinchi xato"];
  const widths = head.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i]).length)));
  const line = (cells) => cells.map((c, i) => String(c).padEnd(widths[i])).join("  ");
  return [line(head), widths.map((w) => "-".repeat(w)).join("  "), ...rows.map(line)].join("\n");
}

export function printFailures(gates, limit = 6) {
  for (const gate of gates) {
    const failed = gate.checks.filter((c) => c.status === "fail");
    if (!failed.length) continue;
    console.log(`\n${gate.id} ${gate.name}: ${failed.length} xato`);
    for (const c of failed.slice(0, limit)) {
      console.log(`  - ${c.id}`);
      for (const l of (c.detail ?? "").split("\n").slice(0, 4)) console.log(`      ${l}`);
    }
    if (failed.length > limit) console.log(`  … yana ${failed.length - limit}`);
  }
}

function section(title, lines) {
  return lines.length ? [`## ${title}`, "", ...lines, ""] : [];
}

function checkLines(gates, status, limit) {
  const out = [];
  for (const gate of gates) {
    const items = gate.checks.filter((c) => c.status === status);
    if (!items.length) continue;
    out.push(`### ${gate.id} ${gate.name} (${items.length})`, "");
    for (const c of items.slice(0, limit)) {
      out.push(`- \`${c.id}\`${c.evidence ? ` · dalil: \`${c.evidence}\`` : ""}`);
      for (const l of (c.detail ?? "").split("\n").slice(0, 8))
        out.push(`  - ${l.replace(/`/g, "'")}`);
    }
    if (items.length > limit) out.push(`- … yana ${items.length - limit}`);
    out.push("");
  }
  return out;
}

export function renderReport(ctx, extra = {}) {
  const ok = ctx.gates.every((g) => g.status !== "fail");
  const lines = [
    "# Tekshiruv hisoboti · docs/qa/report.md",
    "",
    `- Rejim: **${ctx.mode}** · Holat: **${ok ? "oʻtdi" : "xato"}** · Boshlanish: ${new Date(ctx.startedAt).toISOString()} · Davomiylik: ${formatDuration(Date.now() - ctx.startedAt)}`,
    extra.treeHash ? `- Daraxt xeshi: \`${extra.treeHash}\`` : "",
    extra.state
      ? `- cleanPasses: ${extra.state.cleanPasses} · kutilayotgan kontent: ${extra.state.pendingContent}`
      : "",
    "",
    "## Darvozalar",
    "",
    "| Darvoza | Nomi | Holat | oʻtdi | xato | ogoh | istisno | oʻtk | Vaqt |",
    "|---|---|---|---|---|---|---|---|---|",
    ...ctx.gates.map(
      (g) =>
        `| ${g.id} | ${g.name} | ${LABEL[g.status] ?? g.status} | ${count(g, "pass")} | ${count(g, "fail")} | ${count(g, "warn")} | ${count(g, "waived")} | ${count(g, "skip")} | ${formatDuration(g.ms ?? 0)} |`,
    ),
    "",
    ...section("Xatolar", checkLines(ctx.gates, "fail", 40)),
    ...section("Ogohlantirishlar", checkLines(ctx.gates, "warn", 20)),
    ...section("Oʻtkazib yuborilgan", checkLines(ctx.gates, "skip", 20)),
    ...section("Istisnolar", [
      ...ctx.usedWaivers.map(
        (w) => `- \`${w.id}\` · ${w.browser} · dalil: ${w.evidence} · zaxira: ${w.fallback}`,
      ),
      ...ctx.waiverErrors.map((e) => `- rad etildi: ${e}`),
    ]),
    ...section(
      "Baholash kartasi",
      extra.state
        ? [
            `Topilmalar: blocker ${extra.state.findings.blocker}, major ${extra.state.findings.major}, minor ${extra.state.findings.minor}, gʻoyalar ${extra.state.findings.ideas}`,
            "",
            "| Mezon | Baho |",
            "|---|---|",
            ...Object.entries(extra.state.scorecard).map(([k, v]) => `| ${k} | ${v} |`),
          ]
        : [],
    ),
    ...section(
      "Tasdiq kutayotgan kontent",
      ctx.pending.length
        ? [
            `${ctx.pending.length} ta yozuv (listPendingContent).`,
            "",
            "| Soha | Yozuv | Holat | Izoh |",
            "|---|---|---|---|",
            ...ctx.pending.map((p) => `| ${p.area} | ${p.id} | ${p.status} | ${p.note} |`),
          ]
        : ["Kutilayotgan kontent yoʻq."],
    ),
  ];
  return lines.filter((l, i, arr) => !(l === "" && arr[i - 1] === "")).join("\n") + "\n";
}

export function writeReport(ctx, extra) {
  writeText("docs/qa/report.md", renderReport(ctx, extra));
}
