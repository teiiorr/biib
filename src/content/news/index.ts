import { upopTrendTaqdimoti } from "./upop-trend-taqdimoti";
import { upopTrendYangiMavsum } from "./upop-trend-yangi-mavsum";
import { bolalarIshlariKorgazmasi } from "./bolalar-ishlari-korgazmasi";
import { teatrStudiyalariKorsatuvi } from "./teatr-studiyalari-korsatuvi";
import { ustozlarUchunSeminar } from "./ustozlar-uchun-seminar";
import { birinchiMultfilmlar } from "./birinchi-multfilmlar";
import type { NewsArticle } from "../types";

/** Yangidan eskiga tartiblangan. */
export const NEWS: readonly NewsArticle[] = [
  upopTrendTaqdimoti,
  upopTrendYangiMavsum,
  bolalarIshlariKorgazmasi,
  teatrStudiyalariKorsatuvi,
  ustozlarUchunSeminar,
  birinchiMultfilmlar,
].sort((a, b) => (a.date < b.date ? 1 : -1));
