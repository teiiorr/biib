import { bundledSnapshot } from "../../src/content/bundled";
import { selectNewsSlugs } from "../../src/content/select";
import { allRoutes as routesFor } from "../../src/i18n/routes";

/* Testlar repodagi kontent nusxasi bilan ishlaydi: yangilik sluglari shu nusxadan. */
export const NEWS_SLUGS = selectNewsSlugs(bundledSnapshot());
export const allRoutes = () => routesFor(NEWS_SLUGS);

export { PAGE_KEYS, pathFor } from "../../src/i18n/routes";
export type { PageKey } from "../../src/i18n/routes";
export { isLocale, LOCALE_META, LOCALES } from "../../src/i18n/locales";
export type { Locale } from "../../src/i18n/locales";
export { getDictionary } from "../../src/i18n/dictionaries";
