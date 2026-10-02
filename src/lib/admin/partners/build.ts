import { PEOPLE_COPY } from "../copy-people";
import { optionalLocalized, requireAll, type BuildResult } from "../record";
import { normalizeLocalized } from "../text/locales";
import type { PartnerAdmin, PartnerPayload } from "./types";

const HREF_MAX = 300;
const E = PEOPLE_COPY.errors;

/**
 * Sxemasiz manzilga («unicef.org/uz») https qoʻshiladi. «http:», «mailto:» kabi boshqa sxema
 * oʻzgarmaydi va tekshiruvda rad etiladi; «sayt.uz:8080» manzilidagi port esa sxema emas.
 */
export function normalizeHref(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return /^[a-z][a-z0-9+.-]*:(?!\d)/i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function hrefError(href: string): string | null {
  if (!href.startsWith("https://")) return E.hrefScheme;
  if (href.length > HREF_MAX || /\s/.test(href)) return E.hrefShape;
  try {
    const url = new URL(href);
    return url.hostname.includes(".") ? null : E.hrefShape;
  } catch {
    return E.hrefShape;
  }
}

/**
 * Nom besh tilda majburiy, chunki qoralama ham saytda koʻrinadi; manzil faqat https.
 * Brauzer ham, server amali ham shu funksiyani chaqiradi.
 */
export function buildPartner(payload: PartnerPayload): BuildResult<PartnerAdmin> {
  const errors: Record<string, string> = {};
  const nameText = normalizeLocalized(payload.name);
  const visible = payload.status !== "pending";
  if (visible) requireAll(errors, "name", nameText);
  const name = visible ? nameText : optionalLocalized(errors, "name", nameText);

  const href = normalizeHref(payload.href);
  const problem = href ? hrefError(href) : null;
  if (problem) errors.href = problem;

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    input: {
      ...(payload.id ? { id: payload.id } : {}),
      status: payload.status,
      group: payload.group,
      name,
      logoId: payload.logoId,
      href: href || null,
    },
  };
}
