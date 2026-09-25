import Link from "next/link";
import { preload } from "react-dom";

import { PalakFallback } from "@/components/layout/PalakFallback";
import { getDictionary } from "@/i18n/dictionaries";
import { LOCALE_META, LOCALES } from "@/i18n/locales";
import { APPEARANCE_BOOT_SCRIPT } from "@/lib/appearance/boot";
import { FONT_CLASS, fontPreloads } from "@/lib/fonts";
import { pathFor } from "@/i18n/routes";
import { siteUrl } from "@/lib/site";

import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL(siteUrl()),
  title: "Sahifa topilmadi",
  robots: { index: false, follow: false },
};

/** Nomaʼlum til yoki xaritadan tashqari yoʻl: 404 oʻzbek lotinida, beshta til bosh sahifasiga havola. */
export default function GlobalNotFound() {
  const dict = getDictionary("uz");
  for (const href of fontPreloads("uz")) {
    preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  }
  return (
    <html
      lang="uz-Latn"
      className={FONT_CLASS}
      data-design="atlas"
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT_SCRIPT }} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>
        <main id="content" className="container-site error-view">
          <PalakFallback />
          <h1 className="t-h1">{dict.errors.global.title}</h1>
          <p className="t-body-l text-ink-2 measure">{dict.errors.global.text}</p>
          <ul className="flex flex-wrap gap-2">
            {LOCALES.map((l) => (
              <li key={l}>
                <Link
                  href={pathFor(l, "home")}
                  lang={LOCALE_META[l].htmlLang}
                  hrefLang={LOCALE_META[l].htmlLang}
                  className="ui-button t-label inline-flex items-center rounded-control bg-tint px-6 text-on-tint"
                  data-size="48"
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
