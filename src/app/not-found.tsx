import { DEFAULT_LOCALE, LOCALE_META } from "@/i18n/locales";
import "@/styles/globals.css";

/**
 * Til prefiksisiz kelgan nomaʼlum manzil. Bu yerda tarjima yöq — qaysi
 * til kerakligi nomaʼlum, şuning uçun asosiy tilga qaytaramiz.
 */
export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body className="grid min-h-dvh place-items-center p-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <p className="text-title1">404</p>
          <a
            href={LOCALE_META[DEFAULT_LOCALE].prefix}
            className="inline-flex h-12 items-center rounded-md bg-accent px-5 text-headline font-semibold text-accent-contrast"
          >
            Bosh sahifa
          </a>
        </div>
      </body>
    </html>
  );
}
