import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TextEditor } from "@/components/admin/TextEditor";
import { Heading } from "@/components/ui/Heading";
import { LinkButton } from "@/components/ui/LinkButton";
import { pathFor } from "@/i18n/routes";
import { TEXT_KEY_RE, textKind } from "@/i18n/text-overrides";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { textLimit, tokensOf } from "@/lib/admin/texts/build";
import { catalogEntry, pageForKey } from "@/lib/admin/texts/catalog";
import { loadTextOverride } from "@/lib/admin/texts/queries";

import "@/styles/admin-texts.css";

const T = SYSTEM_COPY.texts;
const SECTIONS: Readonly<Record<string, string>> = T.namespaces;

export const metadata: Metadata = { title: T.editTitle };

interface TextEditPageProps {
  readonly params: Promise<{ key: string }>;
  readonly searchParams: Promise<{ q?: string | string[] }>;
}

export default async function TextEditPage({ params, searchParams }: TextEditPageProps) {
  const { key } = await params;
  /* Yoʻl faqat kalit shaklida boʻlsa «next» parametriga yoziladi: ixtiyoriy matn uzatilmaydi. */
  if (key.length > 160 || !TEXT_KEY_RE.test(key)) notFound();
  const session = await requireAdmin(`/admin/matnlar/${key}`);
  const entry = catalogEntry(key);
  if (!entry) notFound();
  const found = await loadTextOverride(adminDb(session.accessToken), key);
  /* Turi lugʻatdagidan farq qilib qolgan eski almashtirish saytda ishlamaydi. Tahrir asl matndan boshlanadi,
     lekin updated_at saqlanadi: yangi qiymat uning ustiga yoziladi yoki «Asliga qaytarish» uni oʻchiradi. */
  const stored = found
    ? {
        value: textKind(found.value.uz) === entry.kind ? found.value : entry.bundled,
        updatedAt: found.updatedAt,
      }
    : null;
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim().slice(0, 80) : "";
  const back = query ? `/admin/matnlar?q=${encodeURIComponent(query)}` : "/admin/matnlar";
  return (
    <section className="admin-page">
      <Heading level={1}>{T.editTitle}</Heading>
      <div className="admin-text-head">
        <LinkButton href={back} variant="glass" size="40" icon="arrow-left">
          {T.back}
        </LinkButton>
        <p className="admin-path t-small">{key}</p>
      </div>
      <TextEditor
        key={key}
        entry={{
          key,
          kind: entry.kind,
          tokens: tokensOf(entry.bundled.uz),
          bundled: entry.bundled,
          limit: textLimit(key) ?? null,
        }}
        stored={stored}
        viewHref={pathFor("uz", pageForKey(key))}
        section={SECTIONS[entry.namespace] ?? entry.namespace}
      />
    </section>
  );
}
