import type { Metadata } from "next";

import { TextsBrowser } from "@/components/admin/TextsBrowser";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ADMIN_COPY } from "@/lib/admin/copy";
import { SYSTEM_COPY } from "@/lib/admin/copy-system";
import { adminDb } from "@/lib/admin/db";
import { requireAdmin } from "@/lib/admin/guard";
import { textRows } from "@/lib/admin/texts/catalog";
import { loadTextOverrides } from "@/lib/admin/texts/queries";

import "@/styles/admin-texts.css";

export const metadata: Metadata = { title: ADMIN_COPY.pages.texts };

interface TextsAdminPageProps {
  readonly searchParams: Promise<{ q?: string | string[] }>;
}

export default async function TextsAdminPage({ searchParams }: TextsAdminPageProps) {
  const session = await requireAdmin("/admin/matnlar");
  const overrides = await loadTextOverrides(adminDb(session.accessToken));
  const { q } = await searchParams;
  return (
    <section className="admin-page">
      <Heading level={1}>{ADMIN_COPY.pages.texts}</Heading>
      <Text tone="ink-2" measure>
        {SYSTEM_COPY.texts.intro}
      </Text>
      <TextsBrowser
        rows={textRows(overrides)}
        initialQuery={typeof q === "string" ? q.slice(0, 80) : ""}
      />
    </section>
  );
}
