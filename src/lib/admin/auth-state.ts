/* Shakl va server amali uchun umumiy tur: amal fayli faqat async funksiyalar eksport qila oladi. */
export interface SignInState {
  readonly status: "idle" | "invalid" | "closed";
  /** Xatodan keyin pochta maydoni boʻshab qolmasin (parol esa qaytarilmaydi). */
  readonly email?: string;
}

export const SIGN_IN_IDLE: SignInState = { status: "idle" };
