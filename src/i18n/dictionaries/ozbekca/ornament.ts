// Avtomatik: scripts/transliterate.mts uz/ornament.ts dan. Qoʻlda tuzatish uchun overrides.ts.
import type { ornament as source } from "../uz/ornament";

export const ornament: typeof source = {
  palakGap: "Palak tikuvçilari bitta çokni ataylab qoldiradi: bu köz tegmasin degan qadimiy odat.",
  palakGapLabel: "Naqşdagi ataylab qoldirilgan böşliq",
  qalampir: "Öqiş jarayoni",
  qalampirValue: "Maqolaning {percent}% öqildi",
};
