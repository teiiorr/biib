"use server";

import { contactSchema, MIN_FILL_MS, type ContactState } from "./schema";

/** Xabar Telegram Bot API ga ketadi; token va chat id faqat serverda. */
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    contact: String(formData.get("contact") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: String(formData.get("consent") ?? ""),
    website: String(formData.get("website") ?? ""),
    startedAt: String(formData.get("startedAt") ?? "0"),
  };
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: NonNullable<ContactState["errors"]> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name") errors.name = "required";
      if (field === "contact") errors.contact = raw.contact.trim() ? "invalidContact" : "required";
      if (field === "message") errors.message = raw.message.trim() ? "tooShort" : "required";
      if (field === "consent") errors.consent = "consentRequired";
      /* Tuzoq toʻldirilgan boʻlsa jim rad etiladi, botga xato koʻrsatilmaydi. */
      if (field === "website") return { status: "success" };
    }
    return { status: "invalid", errors };
  }
  if (Date.now() - parsed.data.startedAt < MIN_FILL_MS) return { status: "tooFast" };

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { status: "error" };

  const text = [
    "Sayt orqali xabar",
    `Ism: ${parsed.data.name}`,
    `Aloqa: ${parsed.data.contact}`,
    "",
    parsed.data.message,
  ].join("\n");
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      cache: "no-store",
    });
    return response.ok ? { status: "success" } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}
