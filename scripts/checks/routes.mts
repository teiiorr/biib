import { bundledSnapshot } from "../../src/content/bundled";
import { selectNewsSlugs } from "../../src/content/select";
import { LOCALE_META } from "../../src/i18n/locales";
import { allRoutes } from "../../src/i18n/routes";

const routes = allRoutes(selectNewsSlugs(bundledSnapshot()));
process.stdout.write(JSON.stringify({ routes, localeMeta: LOCALE_META }));
