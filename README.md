# Bolalar ijodkorligi ijodiy birlaşmasi

Birlaşmaning rasmiy sayti. Beş til, ikki mavzu, barça sahifalar statik
oldindan render qilinadi.

## Işga tuşiriş

```bash
npm install
npm run dev        # http://localhost:3000
```

Prod quriş va tekşiriş:

```bash
npm run build
npm run start
npm run verify     # typecheck + lint + kontrast + imlo + lugat mosligi
```

`npm run verify` deploydan oldin toza ötişi şart. U beşta narsani tekşiradi:

| Buyruq | Nima tekşiradi |
| --- | --- |
| `npm run typecheck` | TypeScript, `strict` rejimda |
| `npm run lint` | ESLint, ogohlantiriş ham xato sanaladi |
| `npm run contrast` | 66 juft rang, ikkala mavzuda, WCAG AA (4.5:1) |
| `npm run orthography` | oʻ/gʻ va ö/ğ/ş/ç imlosi, notöğri apostroflar |
| `npm run parity` | beş lugatdagi kalitlar bir xilligi |

## Muhit özgaruvçilari

`.env.example` dan nusxa oling:

```bash
cp .env.example .env.local
```

- `NEXT_PUBLIC_SITE_URL` — sitemap, robots va canonical uçun.
- `CONTACT_TELEGRAM_BOT_TOKEN`, `CONTACT_TELEGRAM_CHAT_ID` — aloqa şakli
  xabarni şu kanalga yuboradi. Ikkalasi böş bölsa şakl halol xato körsatadi
  va "yuborildi" deb aldamaydi.

## Tuzilma

```
src/app/[locale]/…        yönalişlar
src/components/ui/        tugma, havola-tugma, maydon — CVA variantlari
src/components/brand/     Icon, MarkerUnderline, Reveal, örinbosarlar
src/components/sections/  sarlavha, podval, bölimlar
src/content/              beş tilli maʼlumot: loyihalar, yangiliklar, odamlar
messages/<locale>.json    interfeys matnlari
src/i18n/                 tillar, yönaliş, imlo
src/styles/tokens.css     ikkala mavzu uçun barça ranglar
scripts/                  tekşiruv skriptlari
design/logo-source/       logotipning asl fayllari (saytga çiqmaydi)
```

## Beş til

| Kod | URL | Nom |
| --- | --- | --- |
| `uz-Latn` | `/uz` | Oʻzbekcha |
| `uz-Cyrl` | `/oz` | Ўзбекча |
| `uz-Latn-x-reform` | `/ozbekca` | Özbekça |
| `ru` | `/ru` | Русский |
| `en` | `/en` | English |

Har bir til alohida lugat: hеç narsa iş paytida transliteratsiya qilinmaydi.
Yagona istisno — sana va oy nomlari: CLDR da yangi imlo yöq, şuning uçun
`src/i18n/orthography.ts` Intl çiqişini `ö ğ ş ç` ga öfiradi.

Yangi kalit qöşsangiz beşta faylga ham qöşing, keyin `npm run parity`.

## Mavzular

Barça ranglar `src/styles/tokens.css` da. Komponentlarda hex yozilmaydi.
Yoruğ — asosiy, qoronği alohida sozlangan, "teskari" qilinmagan.
Tanlov brauzerda saqlanadi; hidratsiyadan oldin ingiçka skript `data-theme`
ni qöyadi, şuning uçun sahifa oq bölib çaqnamaydi.

Rang özgartirsangiz `npm run contrast` ni qayta yuriting.

## Mijozdan kutilayotgan maʼlumot

Sayt töliq işlaydi, ammo quyidagi joylarda vaqtinça örinbosar turibdi.
Ularni almaştiriş uçun rasm çiziş kerak emas — faqat maydonni töldiriş.

| Fayl | Nima kerak |
| --- | --- |
| `src/content/people.ts` | Kengaş aʼzolari va rahbariyatning haqiqiy ism-şarifi, lavozimi, tavsifi; `photo` maydoniga surat yöli |
| `src/content/partners.ts` | Hamkorlarning nomi (`name`), logotipi (`logo`) va sayti (`href`) |
| `src/content/news.ts` | Har bir yangilikka `cover` — muqova sureti |
| `src/content/org.ts` | Telefon, poçta, ijtimoiy tarmoq havolalari, xarita nuqtasi |
| `src/content/org-text.ts` | Manzil va iş vaqti, beş tilda |

`photo`, `cover`, `logo` böş bölsa çizilgan örinbosar körsatiladi: böyalgan
maydon va yozuv. Böş kulrang quti çiqmaydi, ammo nimani almaştiriş kerakligi
darrov bilinadi.

Loyihalar va yangiliklar matni `src/content/*.ts` da, beş tilda birga turadi —
bitta til tuşib qolsa TypeScript darrov aytadi.

## Bezak haqida

Sahifalarda suzuvçi bezak yöq: na çizma, na rangli dogʻ. Ritm faqat
tipografika, boşliq, böyalgan panellar va qisqa rangli çiziqçalar bilan
beriladi. Belgi qöyiladigan yagona joy — interfeys elementlari (til, mavzu,
oʻq, telefon, ijtimoiy tarmoq), ular Lucide töplamidan.

Tugma körinişidagi havola `LinkButton` orqali beriladi: Radix `Slot`
ataylab işlatilmaydi, çunki server komponentidan mijoz komponenti bola
sifatida uzatilganda u "lazy" bölib keladi va Slot xato beradi.

## Erişimlilik

- Matn kontrasti ikkala mavzuda AA dan ötadi, şişa ustidagi matn ham.
- Klaviatura bilan töliq işlaydi, fokus halqasi hamma joyda körinadi.
- Menyu va dialogda fokus ipatib turiladi, Escape yopadi.
- Bosiş maydonlari 44 px dan kiçik emas.
- `prefers-reduced-motion` hurmat qilinadi: çiqişlar bir zumda, tebraniş öçadi.
- Har sahifada bitta H1, landmarklar joyida, bezak belgilar `aria-hidden`.

## Tekislik qoidasi

Beş tilda söz uzunligi har xil. Yonma-yon turgan bandlarda sarlavha, izoh va
röyxat qatʼiy qator sonida turadi (`lines-1`, `lines-2`, `lines-3`), şuning
uçun matn uzun bölsa ham hamma yozuv bir çiziqda qoladi. Ustma-ust turganda
(telefon) çegara yumşoqroq.

---

Designed & Developed by teiior
