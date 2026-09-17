"use server";

import {
  contactSchema,
  errorKeyFor,
  type ContactField,
  type ContactState,
  type ErrorKey,
} from "./contact-schema";

/**
 * Aloqa şakli. Tekşiruv serverda — JS öçiq bölsa ham işlaydi.
 * Xabar Telegramga ketadi; sozlama yöq bölsa halol xato qaytadi,
 * "yuborildi" deb aldamaydi.
 *
 * Muhit özgaruvçilari: CONTACT_TELEGRAM_BOT_TOKEN, CONTACT_TELEGRAM_CHAT_ID
 */
export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Asal qopqon: odam köra olmaydigan maydon töldirilgan bölsa — bu bot.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success" };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, ErrorKey>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = errorKeyFor(field, issue);
    }
    return { status: "error", fieldErrors };
  }

  const token = process.env.CONTACT_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.CONTACT_TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { status: "error", delivery: true };

  const { name, email, phone, topic, message } = parsed.data;
  const text = [
    "Sayt orqali xabar",
    "",
    `Ism: ${name}`,
    `Pochta: ${email}`,
    phone ? `Telefon: ${phone}` : null,
    `Mavzu: ${topic}`,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      cache: "no-store",
    });
    if (!response.ok) return { status: "error", delivery: true };
  } catch {
    return { status: "error", delivery: true };
  }

  return { status: "success" };
}
