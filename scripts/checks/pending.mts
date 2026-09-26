import { bundledSnapshot } from "../../src/content/bundled";
import { listPendingContent } from "../../src/content/select";
import { parseSnapshot } from "../../src/content/snapshot";

/* Nusxa sxema orqali oʻtadi: tashqi manba tekshiradigan shakl repodagi maʼlumotga ham mos boʻlsin. */
process.stdout.write(
  JSON.stringify(listPendingContent(parseSnapshot(bundledSnapshot(), "bundled"))),
);
