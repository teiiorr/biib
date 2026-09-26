/**
 * Qurilma quvvati (egasining talabi: kuchsiz telefonda ham qulay, kuchlida — toʻliq effekt).
 * <html data-perf="lite|full"> ni bosh skript qoʻyadi (qurilma belgilari va oldingi oʻlchov),
 * PerfProbe esa birinchi soniyalarda kadr tezligini oʻlchab kerak boʻlsa «lite» ga tushiradi.
 */
export const PERF_STORAGE_KEY = "biib:perf";

export function isLitePerf(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-perf") === "lite";
}
