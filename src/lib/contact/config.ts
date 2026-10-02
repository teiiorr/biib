/** Telegram sozlamalari yigʻish vaqtida oʻqiladi; ular boʻlmasa shakl oʻrniga toʻgʻridan-toʻgʻri havola chiqadi. */
export function contactFormEnabled(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}
