import { formatDate } from "@/i18n/format";

/* Tashkilot Toshkent vaqtida ishlaydi: server (Vercel, UTC) ham shu vaqtni koʻrsatadi. */
const ZONE = "Asia/Tashkent";

const PARTS = new Intl.DateTimeFormat("en-CA", {
  timeZone: ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function parts(date: Date): Record<string, string> {
  return Object.fromEntries(PARTS.formatToParts(date).map((part) => [part.type, part.value]));
}

/** Toshkentdagi bugungi sana (YYYY-MM-DD): yangi yangilikning standart sanasi. */
export function todayInTashkent(now = new Date()): string {
  const p = parts(now);
  return `${p.year}-${p.month}-${p.day}`;
}

/** Jurnal va roʻyxatdagi oʻzgarish vaqti: «2026-yil 27-sentabr, 14:05». */
export function formatStamp(iso: string): string {
  const p = parts(new Date(iso));
  return `${formatDate("uz", `${p.year}-${p.month}-${p.day}`)}, ${p.hour}:${p.minute}`;
}
