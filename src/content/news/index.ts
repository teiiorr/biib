import { upopTrendYangiMavsum } from "./upop-trend-yangi-mavsum";
import { rangliOlamKorgazmasi } from "./rangli-olam-korgazmasi";
import { sahnaBolalariYangiStudiyalar } from "./sahna-bolalari-yangi-studiyalar";
import { ustozlarUchunSeminar } from "./ustozlar-uchun-seminar";
import { ertakUstaxonasiBirinchiMultfilmlar } from "./ertak-ustaxonasi-birinchi-multfilmlar";
import type { NewsArticle } from "../types";

/** Yangidan eskiga tartiblangan. */
export const NEWS: readonly NewsArticle[] = [
  upopTrendYangiMavsum,
  rangliOlamKorgazmasi,
  sahnaBolalariYangiStudiyalar,
  ustozlarUchunSeminar,
  ertakUstaxonasiBirinchiMultfilmlar,
].sort((a, b) => (a.date < b.date ? 1 : -1));
