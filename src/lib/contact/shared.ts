/* zod bu faylga kirmaydi, aks holda forma bilan birga mijoz JS toʻplamiga tushib qoladi. */
export const MIN_MESSAGE = 20;
export const MIN_FILL_MS = 3000;

export type ContactField = "name" | "contact" | "message" | "consent";

export interface ContactState {
  readonly status: "idle" | "success" | "error" | "invalid" | "tooFast";
  readonly errors?: Partial<
    Record<ContactField, "required" | "invalidContact" | "tooShort" | "consentRequired">
  >;
}
