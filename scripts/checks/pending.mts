import { bundledSnapshot } from "../../src/content/bundled";
import { listPendingContent } from "../../src/content/select";
import { parseSnapshot } from "../../src/content/snapshot";

/* Tashqi manbaga qoʻyiladigan sxema talabi repodagi nusxaga ham qoʻyilsin. */
process.stdout.write(
  JSON.stringify(listPendingContent(parseSnapshot(bundledSnapshot(), "bundled"))),
);
