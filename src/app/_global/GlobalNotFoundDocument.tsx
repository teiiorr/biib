import Link from "next/link";
import { preload } from "react-dom";

import { BrandName } from "@/components/layout/BrandName";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Heading } from "@/components/ui/Heading";
import { getDictionary } from "@/i18n/dictionaries";
import { LOCALE_META, LOCALES } from "@/i18n/locales";
import { pathFor } from "@/i18n/routes";
import { AppearanceBootFallback } from "@/lib/appearance/BootFallback";
import { APPEARANCE_BOOT_SCRIPT } from "@/lib/appearance/boot";
import { fontPreloads } from "@/lib/fonts";

/**
 * Tildan tashqaridagi 404 hujjati (oʻzbek lotinida, beshta til bosh sahifasiga havola). Ikki yoʻldan
 * keladi: xaritada yoʻq manzil (global-not-found) va nomaʼlum til segmenti (/zz — ildiz not-found).
 * Sarlavha panelisiz hujjat: brend belgisi sarlavha ustida turadi. Tillar bitta tinch havolalar
 * qatori: beshta teng ustuvor yoʻl, bitta asosiy harakat emas.
 */
export function GlobalNotFoundDocument() {
  const dict = getDictionary("uz");
  for (const href of fontPreloads("uz")) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }
  return (
    <html lang="uz-Latn" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT_SCRIPT }} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{dict.errors.global.title}</title>
      </head>
      <body>
        <AppearanceBootFallback />
        <main id="content" className="container-site error-view">
          <div className="brand-mark error-view-brand">
            <BrandLogo alt="" eager />
            <BrandName />
            <span className="sr-only">{dict.common.brand.name}</span>
          </div>
          <Heading level={1}>{dict.errors.global.title}</Heading>
          <ul className="error-view-locales">
            {LOCALES.map((l) => (
              <li key={l}>
                <Link
                  href={pathFor(l, "home")}
                  lang={LOCALE_META[l].htmlLang}
                  hrefLang={LOCALE_META[l].htmlLang}
                  className="t-label-l"
                >
                  {LOCALE_META[l].nativeName}
                </Link>
              </li>
            ))}
          </ul>
        </main>
      </body>
    </html>
  );
}
