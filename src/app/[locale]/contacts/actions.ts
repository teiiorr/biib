"use server";

import { z } from "zod";

/**
 * Aloqa şakli. Tekşiruv serverda — JS öçiq bölsa ham işlaydi.
 * Xabar Telegramga ketadi; sozlama yöq bölsa halol xato qaytadi,
 * "yuborildi" deb aldamaydi.
 *
 * Kerakli muhit özgaruvçilari:
 *   CONTACT_TELEGRAM_BOT_TOKEN
 *   CONTACT_TELEGRAM_CHAT_ID
 */

const MESSAGE_MIN = 10;

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  topic: z.string().trim().min(2).max(120),
  message: z.string().trim().min(MESSAGE_MIN).max(2000),
});

export type ContactField = "name" | "email" | "phone" | "topic" | "message";

export interface ContactState {
  status: "idle" | "success" | "error";
  /** Lugat kalitlari: form.required, form.invalidEmail, form.tooShort. */
  fieldErrors?: Partial<Record<ContactField, string>>;
  formError?: boolean;
  /** tooShort xabari uçun. */
  minLength?: number;
}

export const INITIAL_CONTACT_STATE: ContactState = { status: "idle" };

function errorKey(field: ContactField, issue: z.core.$ZodIssue): string {
  if (field === "email" && issue.code === "invalid_format") return "invalidEmail";
  if (issue.code === "too_small") return field === "message" ? "tooShort" : "required";
  if (issue.code === "too_big") return "tooLong";
  return "required";
}

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Asal qopqon: odam köra olmaydigan maydon töldirilgan bölsa — bu bot.
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success" };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField | undefined;
      if (field && !fieldErrors[field]) fieldErrors[field] = errorKey(field, issue);
    }
    return { status: "error", fieldErrors, minLength: MESSAGE_MIN };
  }

  const token = process.env.CONTACT_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.CONTACT_TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { status: "error", formError: true };

  const { name, email, phone, topic, message } = parsed.data;
  const text = [
    `Sayt orqali xabar`,
    ``,
    `Ism: ${name}`,
    `Pochta: ${email}`,
    phone ? `Telefon: ${phone}` : null,
    `Mavzu: ${topic}`,
    ``,
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
    if (!response.ok) return { status: "error", formError: true };
  } catch {
    return { status: "error", formError: true };
  }

  return { status: "success" };
}
