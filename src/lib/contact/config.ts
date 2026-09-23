/** Telegram sozlamalari yigʻish vaqtida oʻqiladi: boʻlmasa shakl oʻrniga toʻgʻridan-toʻgʻri havola (15.9). */
export function contactFormEnabled(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}
