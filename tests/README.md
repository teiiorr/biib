# Testlar

Playwright testlari. Ishga tushirish: `pnpm test:e2e` (production server 3100-portda ishlab turishi kerak)
yoki barcha tekshiruvlar bilan birga `node scripts/verify.mjs --full`.

Muhit oʻzgaruvchisi: `BASE_URL` (sukut boʻyicha `http://localhost:3100`). Saytda bitta dizayn (Atlas)
va bitta, tungi mavzu bor.

## Sahifadagi belgilar

`data-testid`: `skip-link`, `header`, `tab-bar`, `menu-sheet`, `appearance-open`, `appearance-panel`,
`slider-transparency`, `slider-density`, `language-open`, `language-menu`, `contact-form`,
`footer`, `portal-scene`.

Atributlar: `[data-card-group]` (karta guruhi), `[data-card]`, `[data-card-title]`, `[data-card-cta]`,
`[data-grid-item]` (toʻr chetiga tekislanishi tekshiriladi), `[data-audit]` (gap va padding shkalasi),
`[data-clamp]` (ataylab qisqartirilgan matn), `[data-icon-optical]` (belgi markazi).

Natijalar `tests/reporter.ts` orqali `.verify/results/<gate>.json` fayllariga yoziladi.
