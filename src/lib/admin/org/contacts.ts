import type { ContentStatus, Localized } from "@/content/types";

import { ORG_COPY } from "../copy-org";
import { emptyLocalized } from "../text/locales";
import {
  httpsUrl,
  normalizePhone,
  optionalLocalized,
  telegramUrl,
  validEmail,
  type DetailDraft,
  type ErrorBag,
} from "./fields";
import type { ContactsAdmin, OrgSaveState, SocialAdmin, SocialNetwork } from "./types";

const E = ORG_COPY.errors;

export const NETWORKS: readonly SocialNetwork[] = ["telegram", "instagram", "youtube", "facebook"];

/** Saqlangandan keyin tahrirga qaytadigan holat: meʼyorlangan qiymatlar. */
export interface ContactsSaved {
  readonly contacts: ContactsAdmin;
  readonly socials: readonly SocialAdmin[];
}

export type SaveContactsState = OrgSaveState<ContactsSaved>;

/** Tahrir holati: raqamlar va havolalar xom matn, tekshiruv va meʼyorlash buildContacts da. */
export interface ContactsDraft {
  readonly address: DetailDraft<Localized>;
  readonly postalCode: string;
  readonly locality: string;
  readonly phones: DetailDraft<readonly string[]>;
  readonly email: DetailDraft<string>;
  readonly telegram: DetailDraft<string>;
  readonly hours: DetailDraft<Localized>;
  readonly map: { readonly lat: string; readonly lng: string; readonly status: ContentStatus };
  /** Doim toʻrtta tarmoq, saytdagi tartibda; havolasi boʻshi saytdan olinadi. */
  readonly socials: readonly SocialAdmin[];
}

/** Xatoga fokus tartibi = sahifadagi tartib (xato kalitlari bilan bir xil nomlar). */
export function contactsErrorOrder(draft: ContactsDraft): readonly string[] {
  return [
    "address",
    "postalCode",
    "locality",
    ...draft.phones.value.map((_, index) => `phone-${index}`),
    "phones-add",
    "email",
    "telegram",
    "hours",
    "map-lat",
    "map-lng",
    ...draft.socials.flatMap((s) => [`social-${s.id}-href`, `social-${s.id}-label`]),
  ];
}

export function draftFromContacts(
  data: ContactsAdmin,
  socials: readonly SocialAdmin[],
): ContactsDraft {
  const present = new Set(socials.map((s) => s.id));
  const missing = NETWORKS.filter((id) => !present.has(id)).map((id): SocialAdmin => ({
    id,
    href: "",
    label: ORG_COPY.contacts.networks[id],
    status: "confirmed",
  }));
  return {
    address: { value: data.address.value ?? emptyLocalized(), status: data.address.status },
    postalCode: data.postalCode ?? "",
    locality: data.locality ?? "",
    phones: { value: data.phones.value ?? [], status: data.phones.status },
    email: { value: data.email.value ?? "", status: data.email.status },
    telegram: { value: data.telegram.value ?? "", status: data.telegram.status },
    hours: { value: data.hours.value ?? emptyLocalized(), status: data.hours.status },
    map: {
      lat: data.map.value ? String(data.map.value.lat) : "",
      lng: data.map.value ? String(data.map.value.lng) : "",
      status: data.map.status,
    },
    socials: [...socials, ...missing],
  };
}

function coordinate(errors: ErrorBag, key: string, raw: string, limit: number): number | null {
  const text = raw.trim().replace(",", ".");
  if (!text) return null;
  const value = Number(text);
  if (!/^-?\d+(\.\d+)?$/.test(text) || Math.abs(value) > limit) {
    errors[key] = limit === 90 ? E.lat : E.lng;
    return null;
  }
  /* Bazada numeric(9,6): oltinchi xonagacha. */
  return Math.round(value * 1e6) / 1e6;
}

function phones(errors: ErrorBag, draft: ContactsDraft): readonly string[] | null {
  const out: string[] = [];
  draft.phones.value.forEach((raw, index) => {
    if (!raw.trim()) return;
    const phone = normalizePhone(raw);
    if (phone) out.push(phone);
    else errors[`phone-${index}`] = E.phone;
  });
  if (!out.length && draft.phones.status === "confirmed") errors["phones-add"] = E.confirmedEmpty;
  return out.length ? out : null;
}

function text(
  errors: ErrorBag,
  key: string,
  detail: DetailDraft<string>,
  check: (value: string) => string | null,
  message: string,
): string | null {
  const raw = detail.value.trim();
  if (!raw) {
    if (detail.status === "confirmed") errors[key] = E.confirmedEmpty;
    return null;
  }
  const value = check(raw);
  if (!value) errors[key] = message;
  return value;
}

function socials(errors: ErrorBag, list: readonly SocialAdmin[]): readonly SocialAdmin[] {
  return list.flatMap((social) => {
    if (!social.href.trim()) return [];
    const href = httpsUrl(social.href);
    const label = social.label.trim();
    if (!href) errors[`social-${social.id}-href`] = E.https;
    if (!label) errors[`social-${social.id}-label`] = E.label;
    return href && label ? [{ ...social, href, label }] : [];
  });
}

export type ContactsBuild =
  | {
      readonly ok: true;
      readonly contacts: ContactsAdmin;
      readonly socials: readonly SocialAdmin[];
    }
  | { readonly ok: false; readonly errors: ErrorBag };

/** Brauzer va server amali bir xil tekshiradi: xato ikkalasida bir xil chiqadi. */
export function buildContacts(draft: ContactsDraft): ContactsBuild {
  const errors: ErrorBag = {};
  const address = optionalLocalized(errors, "address", draft.address.value, draft.address.status);
  const postalCode = draft.postalCode.trim();
  if (postalCode && !/^\d{6}$/.test(postalCode)) errors.postalCode = E.postalCode;
  const locality = draft.locality.trim();
  if (locality.length > 80 || /[^\p{Script=Latin}\s.'-]/u.test(locality))
    errors.locality = E.locality;
  const phoneList = phones(errors, draft);
  const email = text(errors, "email", draft.email, (v) => (validEmail(v) ? v : null), E.email);
  const telegram = text(errors, "telegram", draft.telegram, telegramUrl, E.telegram);
  const hours = optionalLocalized(errors, "hours", draft.hours.value, draft.hours.status);
  const lat = coordinate(errors, "map-lat", draft.map.lat, 90);
  const lng = coordinate(errors, "map-lng", draft.map.lng, 180);
  if (!errors["map-lat"] && !errors["map-lng"]) {
    if (lat === null && lng !== null) errors["map-lat"] = E.mapPair;
    else if (lat !== null && lng === null) errors["map-lng"] = E.mapPair;
    else if (lat === null && draft.map.status === "confirmed") errors["map-lat"] = E.confirmedEmpty;
  }
  const links = socials(errors, draft.socials);
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    contacts: {
      address: { value: address, status: draft.address.status },
      postalCode: postalCode || null,
      locality: locality || null,
      phones: { value: phoneList, status: draft.phones.status },
      email: { value: email, status: draft.email.status },
      telegram: { value: telegram, status: draft.telegram.status },
      hours: { value: hours, status: draft.hours.status },
      map: {
        value: lat !== null && lng !== null ? { lat, lng } : null,
        status: draft.map.status,
      },
    },
    socials: links,
  };
}
