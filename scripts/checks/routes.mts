import { LOCALE_META } from "../../src/i18n/locales";
import { allRoutes } from "../../src/i18n/routes";

process.stdout.write(JSON.stringify({ routes: allRoutes(), localeMeta: LOCALE_META }));
