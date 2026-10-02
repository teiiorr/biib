/**
 * data-perf qiymatini bosh skript qurilma belgilariga qarab qoʻyadi; PerfProbe birinchi soniyalarda
 * kadr tezligini oʻlchab, kerak boʻlsa «lite» rejimiga oʻtkazadi.
 */
export const PERF_STORAGE_KEY = "biib:perf";

export function isLitePerf(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-perf") === "lite";
}
