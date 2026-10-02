# Bolalar Ijodkorligi Ijodiy Birlashmasi sayti

Birlashmaning rasmiy sayti. Next.js (App Router), TypeScript, Tailwind CSS 4, GSAP va Lenis asosida.
Sayt beshta tilda, bitta dizaynda (Atlas) va faqat tungi mavzuda ishlaydi.

## Ishga tushirish

```bash
pnpm install
pnpm dev                   # http://localhost:3000
pnpm build && pnpm start   # ishlab chiqarish yigʻmasi, port 3100
pnpm verify:quick          # tiplar, lint, imlo va gigiyena
pnpm verify:full           # toʻliq tekshiruv: yigʻma, 70 sahifa, brauzerlar matritsasi
```

Dev server ishlab turganda `pnpm build` buyrugʻini ishga tushirmang.

## Tuzilma

| Papka                     | Vazifasi                                                          |
| ------------------------- | ----------------------------------------------------------------- |
| `src/app`                 | Marshrutlar (`[locale]/…`), faqat yupqa sahifa fayllari.          |
| `src/components/ui`       | Tugma, matn, shakl maydonlari, jadval, ikonkalar.                 |
| `src/components/glass`    | Boshqaruv qatlamining Oyna materiali va koʻrinish paneli.         |
| `src/components/motion`   | GSAP sozlamalari, Lenis, ochilish va sahifa oʻtishlari.           |
| `src/components/layout`   | Sarlavha, tab-bar, futer, boʻlim ramkalari.                       |
| `src/components/sections` | Sahifa boʻlimlari.                                                |
| `src/designs/atlas`       | Kechiktirib yuklanadigan badiiy qatlam (qahramon videosi).        |
| `src/content`             | Kontent: loyihalar, yangiliklar, odamlar, hamkorlar, aloqa.       |
| `src/i18n`                | Tillar, marshrutlar xaritasi, lugʻatlar, transliteratsiya.        |
| `src/styles`              | Tokenlar, Tailwind mavzusi, materiallar.                          |
| `scripts`                 | Tekshiruv (`verify.mjs`), transliteratsiya, media, rasmlar.       |
| `tests`                   | Playwright: marshrutlar, joylashuv, qulaylik, unumdorlik, vizual. |

## Tillar

Beshta til bor: `uz` (lotin, joriy imlo), `oz` (kirill), `ozbekca` (2026-yilgi imlo), `ru`, `en`.
Interfeys matnlari `src/i18n/dictionaries/uz` papkasida yoziladi, `ru` va `en` qoʻlda tarjima
qilinadi, `oz` va `ozbekca` esa `pnpm translit` buyrugʻi bilan yaratiladi. Qoʻlda kiritiladigan
tuzatishlar `oz/overrides.ts` va `ozbekca/overrides.ts` fayllariga yoziladi, avtomatik yaratilgan
fayllarga tegilmaydi.

Imlo qoidasi: oʻ va gʻ harflarida ʻ (U+02BB), tutuq belgisida ʼ (U+02BC) ishlatiladi. Oddiy
apostrof taqiqlangan, tekshiruv uni darhol topadi.

## Kontentni tahrirlash

Kontent (loyihalar, yangiliklar, odamlar, hamkorlar, aloqa, tarix, UPOP TREND galereyasi) beshta
tilda Supabase maʼlumotlar bazasida saqlanadi. Sayt uni bitta `content_snapshot()` soʻrovi bilan
oʻqiydi. Har bir yozuvda `status` maydoni bor: `confirmed` (tasdiqlangan), `draft` (qoralama),
`pending` (maʼlumot kutilmoqda). Tasdiqlanmagan sahifalar `noindex` bilan chiqadi va sitemapda
sanasi koʻrsatilmaydi.

`src/content/snapshot.json` bazaning repodagi nusxasi. Baza ishlamay qolsa sayt shundan oʻqiydi,
tekshiruvlar (`verify`) va testlar esa faqat shu nusxadan foydalanadi. Uni qoʻlda tahrirlamang:

```bash
pnpm content:pull            # snapshot.json faylini bazadan yangilaydi
pnpm content:pull --check    # baza va nusxa bir xilmi, farq boʻlsa roʻyxatini chiqarib xato beradi
pnpm content:seed            # nusxani bazaga yozadi (tiklash uchun; maxfiy kalit faqat .env.local faylida)
```

Manbani `CONTENT_SOURCE` belgilaydi: `bundled` (standart, mahalliy ishlash va tekshiruv uchun) yoki
`supabase` (Vercel). `supabase` rejimida `pnpm build` avval `scripts/cms/prefetch.mts` orqali
kontentning bitta nusxasini `.content-cache/` papkasiga oladi va barcha sahifalar shu nusxadan
yigʻiladi. Keyin sahifalar soatiga bir marta, admin panelda saqlanganda esa darhol yangilanadi.
Yuklangan rasmlar `/uploads/…` manzilidan beriladi: avval `public/uploads` qidiriladi, topilmasa
Supabase ochiq bucketidan olinadi.

Surat va logotiplar `public/brand` papkasiga qoʻyiladi va `scripts/images.mjs` roʻyxatiga
qoʻshiladi. AVIF va WebP nusxalarni `node scripts/images.mjs` yaratadi. Bolalar suratlari faqat
ota-onaning roziligi bilan joylanadi.

## Muhit oʻzgaruvchilari

Roʻyxat `.env.example` faylida: `NEXT_PUBLIC_SITE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
Supabase manzili va kalitlari, `CONTENT_SOURCE`, `CMS_BUILD_FALLBACK`. Telegram qiymatlari
berilmasa, aloqa shakli oʻrnida Telegramga toʻgʻridan-toʻgʻri havola chiqadi.
`SUPABASE_SERVICE_ROLE_KEY` faqat `.env.local` faylida turadi va Vercel sozlamalariga qoʻyilmaydi.
