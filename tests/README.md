# Testlar

Playwright matritsasi (§16, §21.3). Ishga tushirish: `pnpm test:e2e` (server 3100 da boʻlishi kerak) yoki `node scripts/verify.mjs --full`.

Muhit: `BASE_URL` (sukut http://localhost:3100). Saytda bitta dizayn (Atlas) va bitta
(tungi) mavzu.

## Sahifa quruvchilar uchun belgilar

`data-testid`: `skip-link`, `header`, `tab-bar`, `menu-sheet`, `appearance-open`, `appearance-panel`,
`slider-transparency`, `slider-density`, `language-open`, `language-menu`, `contact-form`,
`footer`, `portal-scene`.

Atributlar: `[data-card-group]` (karta guruhi), `[data-card]`, `[data-card-title]`, `[data-card-cta]`,
`[data-grid-item]` (toʻr chetiga tekislanishi tekshiriladi), `[data-audit]` (gap/padding shkalasi),
`[data-clamp]` (rejalashtirilgan qisqartirish), `[data-icon-optical]` (belgi markazi).

Natijalar `.verify/results/<gate>.json` ga `tests/reporter.ts` orqali yoziladi.
