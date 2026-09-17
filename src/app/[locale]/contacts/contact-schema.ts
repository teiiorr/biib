import { z } from "zod";

/**
 * Bir sxema ikki joyda: serverda yuboriş oldidan, klientda maydondan
 * çiqqanda. Qoidalar ikkiga bölinmasin deb alohida faylda turadi —
 * "use server" fayli faqat async funksiya eksport qila oladi.
 */

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  topic: z.string().trim().min(2).max(120),
  message: z.string().trim().min(MESSAGE_MIN).max(MESSAGE_MAX),
});

export type ContactField = keyof z.infer<typeof contactSchema>;

/** Lugat kalitlari: form.required, form.invalidEmail, form.tooShort, form.tooLong. */
export type ErrorKey = "required" | "invalidEmail" | "tooShort" | "tooLong";

export interface ContactState {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<ContactField, ErrorKey>>;
  /** Tekşiruv ötdi, ammo yuborib bölmadi. */
  delivery?: boolean;
}

export const INITIAL_CONTACT_STATE: ContactState = { status: "idle" };

export function errorKeyFor(field: ContactField, issue: z.core.$ZodIssue): ErrorKey {
  if (field === "email" && issue.code === "invalid_format") return "invalidEmail";
  if (issue.code === "too_small") return field === "message" ? "tooShort" : "required";
  if (issue.code === "too_big") return "tooLong";
  return "required";
}

/** Bitta maydonni tekşiradi — blur da işlatiladi. */
export function validateField(field: ContactField, value: string): ErrorKey | undefined {
  const single = contactSchema.pick({ [field]: true } as never);
  const result = single.safeParse({ [field]: value });
  if (result.success) return undefined;
  const issue = result.error.issues[0];
  return issue ? errorKeyFor(field, issue) : "required";
}
