# Bolalar Ijodkorligi Ijodiy Birlashmasi — sayt

Birlashmaning rasmiy sayti. Next.js (App Router), TypeScript, Tailwind CSS 4, GSAP, Lenis.
Beshta til, bitta dizayn (Atlas), faqat tungi mavzu.

## Ishga tushirish

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm build && pnpm start   # ishlab chiqarish yigʻmasi, port 3100
pnpm verify:quick     # tur tekshiruvi, lint, imlo, gigiyena
pnpm verify:full      # toʻliq tekshiruv: yigʻma, 70 sahifa, brauzer matritsasi
```

`pnpm build` ni dev server ishlab turganda ishga tushirmang.

## Tuzilma

| Papka                     | Vazifasi                                                          |
| ------------------------- | ----------------------------------------------------------------- |
| `src/app`                 | Marshrutlar: `[locale]/…`. Faqat yupqa sahifa fayllari.           |
| `src/components/ui`       | Tugma, matn, shakl maydonlari, jadval, ikonkalar.                 |
| `src/components/glass`    | Boshqaruv qatlami materiali Oyna va koʻrinish paneli.             |
| `src/components/motion`   | Harakat: GSAP sozlovi, Lenis, ochilishlar, sahifa oʻtishlari.     |
| `src/components/layout`   | Sarlavha, tab-bar, futer, boʻlim ramkalari.                       |
| `src/components/sections` | Sahifalar boʻlimlari.                                             |
| `src/designs/atlas`       | Kechiktirib yuklanadigan badiiy qatlam (qahramon videosi).        |
| `src/content`             | Kontent: loyihalar, yangiliklar, odamlar, hamkorlar, aloqa.       |
| `src/i18n`                | Tillar, marshrut xaritasi, lugʻatlar, transliteratsiya.           |
| `src/styles`              | Tokenlar (tungi mavzu), Tailwind mavzusi, materiallar.            |
| `scripts`                 | Tekshiruv (`verify.mjs`), transliteratsiya, media, rasmlar.       |
| `tests`                   | Playwright: marshrutlar, joylashuv, qulaylik, unumdorlik, vizual. |

## Tillar

Beshta til: `uz` (lotin, joriy imlo), `oz` (kirill), `ozbekca` (2026 imlosi), `ru`, `en`.
Interfeys matnlari `src/i18n/dictionaries/uz` da yoziladi, `ru` va `en` qoʻlda tarjima qilinadi,
`oz` va `ozbekca` esa `pnpm translit` bilan yaratiladi. Qoʻlda tuzatishlar `oz/overrides.ts` va
`ozbekca/overrides.ts` ga yoziladi, avtomatik fayllar tegilmaydi.

Imlo qoidasi: oʻ va gʻ da ʻ (U+02BB), tutuq belgisida ʼ (U+02BC). Oddiy apostrof taqiqlangan,
tekshiruv uni ushlaydi.

## Kontentni tahrirlash

Hamma matn `src/content` ichida, beshta tilda. Har yozuvning `status` maydoni bor:
`confirmed` (tashkilot tasdiqlagan), `draft` (qoralama), `pending` (fakt kutilmoqda).
Tasdiqlanmagan sahifalar `noindex` bilan chiqadi va sitemapda sana daʼvo qilmaydi.

### Yangilik qoʻshish

1. `src/i18n/routes.ts` dagi `NEWS_SLUGS` ga ASCII slug qoʻshing (masalan `yangi-studiya`).
2. `src/content/news/yangi-studiya.ts` faylini yarating: `NewsArticle` shaklida, beshta tilda.
3. `src/content/news/index.ts` ga import qoʻshing.
4. `pnpm verify:quick`, keyin `pnpm verify:full`.

### Loyiha, odam, hamkor

`src/content/projects.ts`, `experts.ts`, `leadership.ts`, `partners.ts`. Surat va logotiplar
`public/brand` ga qoʻyiladi va `scripts/images.mjs` roʻyxatiga qoʻshiladi (`node scripts/images.mjs`
AVIF/WebP nusxalarni yaratadi); bolalar suratlari faqat ota-ona roziligi bilan. UPOP TREND galereyasi
(8 joy) — `src/content/upop-gallery.ts`, fayllar `public/upop` da.

## Muhit oʻzgaruvchilari

`.env.example` ga qarang: `NEXT_PUBLIC_SITE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
Telegram qiymatlari boʻlmasa aloqa shakli oʻrniga toʻgʻridan-toʻgʻri havola chiqadi.
